/**
 * The Parser is responsible for 
 * - splitting a natural query into several natural conditions
 * - detecting what is currently being types : an attribute token or condition value
 * 
 */
var Parser = function(){
	
	/**
	 * The reg ex pattern that matches with a simple equal condition.
	 * @type {String}
	 */
	this.SIMPLE_EQUAL_PATTERN =           "(\\w+):([^,\\\"\\[\\] ]+)" ;
	/**
	 * The reg ex pattern that matches with a "greater or equal" condition.
	 * @type {String}
	 */
	this.GREATER_OR_EQUAL_PATTERN =       "(\\w+)>([^,\\\"\\[\\] ]+)" ;
	/**
	 * The reg ex pattern that matches with a "lower or equal" condition.
	 * @type {String}
	 */
	this.LOWER_OR_EQUAL_PATTERN =         "(\\w+)<([^,\\\"\\[\\] ]+)" ;
	/**
	 * The reg ex pattern that matches with a "multi value" condition.
	 * @type {String}
	 */
	this.MULTI_VALUE_PATTERN =            "(\\w+):(([^,\\\"\\[\\] ]+)|(\\\"[^\\\"]+\\\"))((,(([^,\\\"\\[\\] ]*)|(\\\"[^\\\"]+\\\")*)+)*)" ;
	/**
	 * The reg ex pattern that matches with a "equal with white space" condition.
	 * @type {String}
	 */
	this.EQUAL_WITH_WHITE_SPACE_PATTERN = "(\\w+):(\\\"[^\\\"]+\\\")" ;
	/**
	 * The reg ex pattern that matches with a "range pattern" condition.
	 * @type {String}
	 */
	this.RANGE_PATTERN =				  "(\\w+):(\\[[^\\[\\]]+\\])" ;

	/**
	 * Public function to get a regular expression used to parse the natural query.
	 * @return {string} the regular expression used to parse the natural query
	 */
	this.buildNaturalQueryRegExp = function () {
		return new RegExp(
				"(" + this.MULTI_VALUE_PATTERN + ")" + 
				"|(" + this.SIMPLE_EQUAL_PATTERN + ")" + 
				"|(" + this.GREATER_OR_EQUAL_PATTERN + ")" + 
				"|(" + this.LOWER_OR_EQUAL_PATTERN + ")" + 
				"|(" + this.EQUAL_WITH_WHITE_SPACE_PATTERN + ")" + 
				"|(" + this.RANGE_PATTERN + ")" , 
			"g") ;
	} ;

	/**
	 * Public function to build a regular expression used from a string pattern
	 * @param  {string} pattern the string representing the reg ex
	 * @return {RegExp} the regular expression
	 */
	this.buildConditionRegExp = function ( pattern ) {
		return new RegExp( "^" + pattern + "$", "g" ) ;
	} ;

	/**
	 * Public function to split a natural query into several conditions
	 * @param  {string} the natural query to split
	 * @return {Array} the array of natural conditions composing the natural query
	 */
	this.splitConditions = function ( naturalQuery ) {
		var naturalQueryRegExp = this.buildNaturalQueryRegExp();
		var naturalConditions = naturalQuery.match(naturalQueryRegExp);
		return naturalConditions;
	} ;
	
	/**
	 * Public function to know if the last part of the input string is an atribute name or not.
	 * For example : 
	 * - isLastTokenAttributeName("country:Denmark language") => returns true.
	 * - isLastTokenAttributeName("country:Denmark language:engli") => returns false.
	 * @param  {string} string a natural query typed by the user (fully or partially)
	 * @return {boolean} true if the last part is interprated as an attribute name
	 */
	this.isLastTokenAttributeName = function ( string ) {
		var lastConditionCurrentlyTyped = this.getLastConditionCurrentlyTyped( string ) ;
		return !lastConditionCurrentlyTyped.match(/(.+):(.*)/) ;
	} ;
	
	/**
	 * Public function to get the last condition currently typed in the input query string.
	 * For example : 
	 * - getLastConditionCurrentlyTyped("country:Denmark language:english ") => returns null
	 * - getLastConditionCurrentlyTyped("country:Denmark language:engli") => returns "language:engli"
	 * - getLastConditionCurrentlyTyped("country:Denmark langua") => returns "langua"
	 * @param  {string} string a natural query typed by the user (fully or partially) 
	 * @return {string} the last condition that is being typed by the user.
	 */
	this.getLastConditionCurrentlyTyped = function ( string ) {
		var fullConditions = this.splitConditions( string ) ;
		var cleanString = string ;
		if ( fullConditions !==  null ) {
			for ( i = 0 ; i < fullConditions.length ; i++ ) {
				// left trim
				cleanString = cleanString.replace(/^\s+/,"") ;
				cleanString = cleanString.replace(fullConditions[i], "") ;
			}
		}
		if ( ( cleanString === "undefined" || cleanString === "") && ( fullConditions !==  null ) ) {
			cleanString = fullConditions[fullConditions.length - 1] ;
		}
		
		if(cleanString === undefined){
			return cleanString;
		}
		return cleanString.trim();
	} ;
} ;