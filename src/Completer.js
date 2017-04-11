/** 
 * Class to use to auto-complete natural queries.
 */
var Completer = function( attributes ){
	this.attributes = attributes;
	this.parser = new Parser();

	/**
	 * Returns the possible queries completed, starting from string typed by the user, given as an argument
	 */
	this.getPossibleCompletedQueries = function( string ){
		if ( this.parser.isLastTokenAttributeName( string ) ) {
			// Case 1 : the user is typing an attribute name
			return this.getMatchingAttributes( string );
		} else {
			// Case 2 : the user is typing an attribute value
			return this.getMatchingValues( string );
		}
	} ;
	
	/**
	 * Returns the list of the attribute names that match with the string argument.
	 */
	this.getMatchingAttributes = function( string ){
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string); 
		var attributeNames = this.getAttributeNames();
		return $.ui.autocomplete.filter(attributeNames, lastConditionCurrentlyTyped);
	} ;
	
	/**
	 * @TODO 
	 * Returns the list of attributes patterns (attributes natural names + authorized condition types) 
	 * which begins with the string argument. 
	 */
	this.getMatchingAttributesPatterns = function( string ){
		return null;
	} ;
	
	/**
	 * Returns the list of values that can complete the string argument.
	 */
	this.getMatchingValues = function( string ){
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string);
		var colonIndex = lastConditionCurrentlyTyped.indexOf(":");
		var attributeName = lastConditionCurrentlyTyped.substring(0, colonIndex );
		var attributeValue ;
		if(lastConditionCurrentlyTyped.indexOf(",") > 0){
			var comaIndex = lastConditionCurrentlyTyped.lastIndexOf(",");
			attributeValue = lastConditionCurrentlyTyped.substring(comaIndex + 1);			
		}else{			
			attributeValue = lastConditionCurrentlyTyped.substring(colonIndex + 1);
		}
		var attributePossibleValues = this.getPossibleValues( attributeName ) ;
		if ( attributePossibleValues === undefined ) {
			return null;
		} else {
			return $.ui.autocomplete.filter(attributePossibleValues, attributeValue);
		}
	} ;
	
	this.getPossibleValuesFromTableValues = function ( attribute ) {
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
	} ;
	
	this.getPossibleValuesFromRestUrl = function ( attribute ) {

	} ;

	this.getPossibleValues = function( attributeName ){
		var attribute = this.getAttribute(attributeName);
		if ( attribute.restSearchUrl !== undefined ) {
			return this.getPossibleValuesFromRestUrl( attribute ) ;
		}
		if ( attribute.possibleValues !== undefined ) {
			return this.getPossibleValuesFromTableValues( attribute ) ;
		}
		return undefined;
	} ;

	this.getAttributeNames = function() {
		var attributeNames = new Array(attributes.length);
		for( i = 0 ; i < attributes.length ; i++ ){
			attributeNames[i] = attributes[i].naturalName;
		}
		return attributeNames;	
	} ;
	
	this.getAttribute = function( attributeName ){
		for( i = 0 ; i < attributes.length ; i++ ){
			if(attributes[i].naturalName == attributeName){
				return attributes[i];
			}
		}
	} ;
	
	this.complete = function( string, selectedItem ){
		var fullConditionsAsString = "";
		var fullConditionsAsArray = this.parser.splitConditions(string);
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string);
		
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
		if(this.parser.isLastTokenAttributeName(string)){
			completedNaturalQuery = fullConditionsAsString + selectedItem.label + ":";
		}else{
			if(lastConditionCurrentlyTyped.indexOf(",") > 0){
				completedNaturalQuery = this.completeMultiValueFilter(fullConditionsAsString, lastConditionCurrentlyTyped, selectedItem);
			}else{
				completedNaturalQuery = this.completeSimpleValueFilter(fullConditionsAsString, lastConditionCurrentlyTyped, selectedItem);
			}
		}
		return completedNaturalQuery;
	} ;
	
	this.completeSimpleValueFilter = function(fullConditions, lastConditionCurrentlyTyped, selectedItem) {
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
	} ;
	
	this.completeMultiValueFilter = function(fullConditions, lastConditionCurrentlyTyped, selectedItem) {
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
	} ;
} ;