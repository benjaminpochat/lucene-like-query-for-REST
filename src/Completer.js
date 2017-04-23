/** 
 * Class to use to auto-complete natural queries.
 * The class is mainly responsible for :
 * - getting the possible stuff matching with what has been typed so far by the user. 
 *   The public function "getPossibleCompletedQueries" do this.
 * - building a natural query from what has been type so far and the value selected among the possible values suggested.
 *   The public function "complete" do that.
 * 
 */
var Completer = function ( attributes ) {
	/**
	 * The parser used interprete what the used has typed so far
	 */
	var parser = new Parser();

	/**
	 * Public function to get the list of queries completed, and suggested to the user, 
	 * matching with the given string, which is what the user has typed so far.
	 * @param {string} string what the user has typed so far, should be the begining of a well formed natural query
	 * @return {Array} the list of completed queries, suggested to the user
	 */
	this.getPossibleCompletedQueries = function ( string ) {
		if ( parser.isLastTokenAttributeName( string ) ) {
			// Case 1 : the user is typing an attribute name
			return getMatchingAttributes( string ) ;
		} else {
			// Case 2 : the user is typing an attribute value
			return getMatchingValues( string ) ;
		}
	} ;
	
	 /**
	  * Public function to get the full natural query, completed with the value selected by the user.
	  * For instance : 
	  * complete('country:Fr', 'United Kingdom') 
	  * => returns 'country:"United Kingdom" '
	  * @param {string} string the incomplete narural query, typed by the user so far
	  * @param {string} selectedItem the item (attribute or value) selected in the list suggested
	  * @return the natural query completed
	  */
	this.complete = function( string, selectedItem ){
		var fullConditionsAsString = "";
		var fullConditionsAsArray = parser.splitConditions(string);
		var lastConditionCurrentlyTyped = parser.getLastConditionCurrentlyTyped(string);
		
		if ( fullConditionsAsArray !==  null ) {
			var fullConditionsLength = fullConditionsAsArray.length;
			if(fullConditionsAsArray[fullConditionsLength - 1] == lastConditionCurrentlyTyped){
				fullConditionsLength -= 1;
			}
			for (i = 0 ; i < fullConditionsLength ; i++ ){
				fullConditionsAsString += fullConditionsAsArray[i] + " ";
			}
		}
		
		var completedNaturalQuery = "";
		if ( parser.isLastTokenAttributeName ( string ) ) {
			completedNaturalQuery = fullConditionsAsString + selectedItem.label + ":";
		}else{
			if(lastConditionCurrentlyTyped.indexOf(",") > 0){
				completedNaturalQuery = completeMultiValueFilter(fullConditionsAsString, lastConditionCurrentlyTyped, selectedItem);
			}else{
				completedNaturalQuery = completeSimpleValueFilter(fullConditionsAsString, lastConditionCurrentlyTyped, selectedItem);
			}
		}
		return completedNaturalQuery;
	} ;

	/**
	 * Private function
	 * @param {string} string the natural query typed so far, 
	 *   where the last token is interprated as the begining of an attribute name
	 * @return {array} the list of the attribute names matching with the string argument.
	 */
	function getMatchingAttributes ( string ) {
		var lastConditionCurrentlyTyped = parser.getLastConditionCurrentlyTyped(string); 
		var attributeNames = getAttributeNames();
		return $.ui.autocomplete.filter(attributeNames, lastConditionCurrentlyTyped);
	} 
		
	/**
	 * Private function
	 * @param {string} string the natural query typed so far, 
	 *   where the last token is interprated as the begining of value (after a semi-colon)
	 * @return {Array} the list of the values matching with the string argument.
	 */
	function getMatchingValues ( string ){
		var lastConditionCurrentlyTyped = parser.getLastConditionCurrentlyTyped(string);
		var colonIndex = lastConditionCurrentlyTyped.indexOf(":");
		var attributeName = lastConditionCurrentlyTyped.substring(0, colonIndex );
		var attributeValue ;
		if(lastConditionCurrentlyTyped.indexOf(",") > 0){
			var comaIndex = lastConditionCurrentlyTyped.lastIndexOf(",");
			attributeValue = lastConditionCurrentlyTyped.substring(comaIndex + 1);			
		}else{			
			attributeValue = lastConditionCurrentlyTyped.substring(colonIndex + 1);
		}
		var attributePossibleValues = getPossibleValues( attributeName ) ;
		if ( attributePossibleValues === undefined ) {
			return null;
		} else {
			return $.ui.autocomplete.filter(attributePossibleValues, attributeValue);
		}
	} 

	/**
	 * Private function to get all the value items possible for the attribute name.
	 * @param {string} attributeName the name of the attribute we'll be looking for values
	 * @return {Array} the list of possible values for the attribute name, unfiltered.
	 */
	function getPossibleValues ( attributeName ){
		var attribute = getAttribute(attributeName);
		if ( attribute.restAPIUrl !== undefined ) {
			return getPossibleValuesFromRestAPI( attribute ) ;
		}
		if ( attribute.possibleValues !== undefined ) {
			return getPossibleValuesFromArrayOfValues( attribute ) ;
		}
		return undefined;
	} 

	/**
	 * Private function to get all the possible values from an array in memory.
	 * @param {Attribute} attribute an attribute, where the values have been given in an array.
	 * @return {Array} all the possible values, unfiltered
	 */
	function getPossibleValuesFromArrayOfValues ( attribute ) {
		if ( ! attribute.mappedValues ) {
			return attribute.possibleValues ;
		} else {
			var possibleValues = [];
			var i = 0 ; 
			while ( i < attribute.possibleValues.length ) {
				possibleValues[i] = attribute.possibleValues[i].value ;
				i++;
			}
			return possibleValues ;
		}
	} 
	
	/**
	 * Private function to get all the possible values from a REST API.
	 * @param {Attribute} attribute an attribute, where the values have to be reteived from a REST API.
	 * @return {Array} all the possible values, unfiltered
	 */
	function getPossibleValuesFromRestAPI ( attribute ) {
		var possibleValues = null ;
		$.ajax({
			url: attribute.restAPIUrl,
			context: document.body,
			async: false,
		 	success: function( result ){
		 		possibleValues = result.map(attribute.restMapperCallback) ;
			}
		} ) ;
		return possibleValues ;	
	} 
	
	/**
	 * Private function to complete a filter with a unique value.
	 * For instance :
	 * completeSimpleValueFilter('continent:Europe demography>10M', 'spokenLanguage:It', 'Italian')
	 * => return 'continent:Europe demography>10M spokenLanguage:Italian '
	 * @param {string} fullConditions a string representing the part of the natural query with conditions fully types, with atribute name and value(s).
	 * @param {string} lastConditionCurrentlyTyped the part of the natural query lastly typed, not uncomplete
	 * @param {string} selectedItem the value selected by the user
	 * @return {string} a complete filter string
	 */
	function completeSimpleValueFilter (fullConditions, lastConditionCurrentlyTyped, selectedItem) {
		var completedNaturalQuery = "";
		var colonIndex = lastConditionCurrentlyTyped.indexOf(":");
		var attributeName = lastConditionCurrentlyTyped.substring(0, colonIndex + 1 );
		var isMultiValueCurrentlyTyped = lastConditionCurrentlyTyped.indexOf(",") > 0;
		var isSelectItemContainsBlanks = selectedItem.label.indexOf(" ") > 0;
		if(isSelectItemContainsBlanks){
			completedNaturalQuery = fullConditions + attributeName + "\"" + selectedItem.label + "\" ";
		}else{
			completedNaturalQuery = fullConditions + attributeName + selectedItem.label + " ";
		}
		return completedNaturalQuery;
	}
	
	/**
	 * Private function to complete a filter with a multiple values.
	 * For instance :
	 * completeSimpleValueFilter('continent:Europe demography>10M', 'spokenLanguage:Italian,Ger', 'German')
	 * => return 'continent:Europe demography>10M spokenLanguage:Italian,German '
	 * @param {string} fullConditions a string representing the part of the natural query with conditions fully types, with atribute name and value(s).
	 * @param {string} lastConditionCurrentlyTyped the part of the natural query lastly typed, not uncomplete
	 * @param {string} selectedItem the value selected by the user
	 * @return {string} a complete filter string
	 */	
	function completeMultiValueFilter (fullConditions, lastConditionCurrentlyTyped, selectedItem) {
		var completedNaturalQuery = "";
		var lastComaIndex = lastConditionCurrentlyTyped.lastIndexOf(",");
		var attributeNameAndFirstValues = lastConditionCurrentlyTyped.substring(0, lastComaIndex + 1 );
		var isSelectItemContainsBlanks = selectedItem.label.indexOf(" ") > 0;
		if(isSelectItemContainsBlanks){
			completedNaturalQuery = fullConditions + attributeNameAndFirstValues + "\"" + selectedItem.label + "\" ";
		}else{
			completedNaturalQuery = fullConditions + attributeNameAndFirstValues + selectedItem.label + " ";
		}
		return completedNaturalQuery;
	}

	/**
	 * Private function to get the names of all the attributes.
	 * @return {Array} the name of all the attributes
	 */
	function getAttributeNames () {
		var attributeNames = new Array(attributes.length);
		for( i = 0 ; i < attributes.length ; i++ ){
			attributeNames[i] = attributes[i].naturalName;
		}
		return attributeNames;	
	} 
	
	/**
	 * Private function to get an Attribute instance from its name.
	 * @param {string} attributeName the name of an attribute
	 * @return {Attribute} an instance of attribute
	 */ 
	function getAttribute ( attributeName ){
		for( i = 0 ; i < attributes.length ; i++ ){
			if(attributes[i].naturalName == attributeName){
				return attributes[i];
			}
		}
	} 	
} ;