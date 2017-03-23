/**
 * The Parser is responsible for 
 * - splitting a natural query into several natural conditions
 * - detecting what is currently being types : an attribute token or condition value
 * 
 */
var Parser = function(){
	this.SIMPLE_EQUAL_PATTERN =           "(\\w+):([^,\\\"\\[\\] ]+)";
	this.GREATER_OR_EQUAL_PATTERN =       "(\\w+)>([^,\\\"\\[\\] ]+)";
	this.LOWER_OR_EQUAL_PATTERN =         "(\\w+)<([^,\\\"\\[\\] ]+)";
	this.MULTI_VALUE_PATTERN =            "(\\w+):(([^,\\\"\\[\\] ]+)|(\\\"[^\\\"]+\\\"))((,(([^,\\\"\\[\\] ]*)|(\\\"[^\\\"]+\\\")*)+)*)"
	this.EQUAL_WITH_WHITE_SPACE_PATTERN = "(\\w+):(\\\"[^\\\"]+\\\")";
	this.RANGE_PATTERN =				  "(\\w+):(\\[[^\\[\\]]+\\])";
	
	this.buildNaturalQueryRegExp = function() {
		return new RegExp(
				"(" + this.MULTI_VALUE_PATTERN + ")" 
				+ "|(" + this.SIMPLE_EQUAL_PATTERN + ")" 
				+ "|(" + this.GREATER_OR_EQUAL_PATTERN + ")"
				+ "|(" + this.LOWER_OR_EQUAL_PATTERN + ")" 
				+ "|(" + this.EQUAL_WITH_WHITE_SPACE_PATTERN + ")" 
				+ "|(" + this.RANGE_PATTERN + ")" , 
			"g");
	};

	this.buildConditionRegExp = function( pattern ) {
		return new RegExp( "^" + pattern + "$", "g" );
	};

	this.splitConditions = function( naturalQuery ) {
		var naturalQueryRegExp = this.buildNaturalQueryRegExp();
		var naturalConditions = naturalQuery.match(naturalQueryRegExp);
		return naturalConditions;
	};
	
	this.isLastTokenAttributeName = function( string ){
		var lastConditionCurrentlyTyped = this.getLastConditionCurrentlyTyped( string );
		return !lastConditionCurrentlyTyped.match(/(.+):(.*)/);
	};
	
	this.getLastConditionCurrentlyTyped = function( string ){
		var fullConditions = this.splitConditions( string );
		var cleanString = string;
		if ( fullConditions !=  null ) {
			for ( i = 0 ; i < fullConditions.length ; i++ ) {
				// left trim
				cleanString = cleanString.replace(/^\s+/,"");
				cleanString = cleanString.replace(fullConditions[i], "");
			}
		}
		if ( ( cleanString == "undefined" || cleanString == "") && ( fullConditions !=  null ) ){
			cleanString = fullConditions[fullConditions.length - 1];
		}
		
		if(cleanString === undefined){
			return cleanString;
		}
		return cleanString.trim();
	}
};