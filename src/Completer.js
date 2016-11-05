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
		var attributeValue = lastConditionCurrentlyTyped.substring(colonIndex + 1);
		var attributePossibleValues = this.getAttribute(attributeName).possibleValues;
		if ( attributePossibleValues === undefined ) {
			return null;
		} else {
			return $.ui.autocomplete.filter(attributePossibleValues, attributeValue);
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
		var fullConditions = this.parser.splitConditions(string);
		var lastConditionCurrentlyTyped = this.parser.getLastConditionCurrentlyTyped(string);
		var completedNaturalQuery = "";
		if ( fullConditions !=  null ) {
			var fullConditionsLength = fullConditions.length;
			if(fullConditions[fullConditionsLength - 1] == lastConditionCurrentlyTyped){
				fullConditionsLength -= 1;
			}
			for (i = 0 ; i < fullConditionsLength ; i++ ){
				completedNaturalQuery += fullConditions[i] + " ";
			}
		}
		if(this.parser.isLastTokenAttributeName(string)){
			completedNaturalQuery += selectedItem.label + ":";
		}else{
			var colonIndex = lastConditionCurrentlyTyped.indexOf(":");
			var attributeName = lastConditionCurrentlyTyped.substring(0, colonIndex + 1 );
			var isSelectItemContainsBlanks = selectedItem.label.indexOf(" ") > 0;
			if(isSelectItemContainsBlanks){
				completedNaturalQuery += attributeName + "\"" + selectedItem.label + "\" ";
			}else{
				completedNaturalQuery += attributeName + selectedItem.label + " ";
			}
		}
		return completedNaturalQuery;
	}
}