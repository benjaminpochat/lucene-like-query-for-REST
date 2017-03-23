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
	};
	
	this.getMatchingAttributes = function( string ){
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string); 
		var attributeNames = this.getAttributeNames();
		return $.ui.autocomplete.filter(attributeNames, lastConditionCurrentlyTyped);
	}
	
	this.getMatchingAttributesPatterns = function( string ){
		// TODO : returns the list of attributes patterns (attributes natural names + authorized condition types) which begins with the string argument. 
		return null;
	};
	
	this.getMatchingValues = function( string ){
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string);
		var colonIndex = lastConditionCurrentlyTyped.indexOf(":");
		var attributeName = lastConditionCurrentlyTyped.substring(0, colonIndex );
		if(lastConditionCurrentlyTyped.indexOf(",") > 0){
			var comaIndex = lastConditionCurrentlyTyped.lastIndexOf(",");
			var attributeValue = lastConditionCurrentlyTyped.substring(comaIndex + 1);			
		}else{			
			var attributeValue = lastConditionCurrentlyTyped.substring(colonIndex + 1);
		}
		var attributePossibleValues = this.getPossibleValues( attributeName ) ;
		if ( attributePossibleValues === undefined ) {
			return null;
		} else {
			return $.ui.autocomplete.filter(attributePossibleValues, attributeValue);
		}
	};
	
	this.getPossibleValues = function( attributeName ){
		var attribute = this.getAttribute(attributeName);
		if ( attribute.possibleValues === undefined ) {
			return undefined;
		}
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
	};
	
	this.getAttributeNames = function() {
		var attributeNames = new Array(attributes.length);
		for( i = 0 ; i < attributes.length ; i++ ){
			attributeNames[i] = attributes[i].naturalName;
		}
		return attributeNames;	
	};
	
	this.getAttribute = function( attributeName ){
		for( i = 0 ; i < attributes.length ; i++ ){
			if(attributes[i].naturalName == attributeName){
				return attributes[i];
			}
		}
	}
	
	this.complete = function( string, selectedItem ){
		var fullConditionsAsString = "";
		var fullConditionsAsArray = this.parser.splitConditions(string);
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string);
		
		if ( fullConditionsAsArray !=  null ) {
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
	}
	
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
	}
	
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
	}
}