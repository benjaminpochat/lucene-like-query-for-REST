var CONTITION_TYPE_SIMPLE_EQUAL = "CONTITION_TYPE_SIMPLE_EQUAL";
var CONTITION_TYPE_GREATER_OR_EQUAL = "CONTITION_TYPE_GREATER_OR_EQUAL";
var CONTITION_TYPE_LOWER_OR_EQUAL = "CONTITION_TYPE_LOWER_OR_EQUAL";
var CONTITION_TYPE_MULTI_VALUE = "CONTITION_TYPE_MULTI_VALUE";
var CONTITION_TYPE_EQUAL_WITH_WHITESPACES = "CONTITION_TYPE_EQUAL_WITH_WHITESPACES";
var CONTITION_TYPE_RANGE = "CONTITION_TYPE_RANGE";

/**
 * Classe that describes an attribute used in a query.
 */
var Attribute = function(){
	
	/**
	 * The name of the attribute as it appears in the natural query, seen by users 
	 * @type {string}
	 */
	this.naturalName = null ;
	
	/**
	 * The list of suggested values for the attribute (used only if restAPIUrl is null)
	 * @type {array}
	 */
	this.possibleValues = null ;

	/**
	 * A boolean to set if the suggested values are given as a key/value map. 
	 * Default is false.
	 * If true, the values of the map are suggested to the users, and the keys are used in the REST search API.
	 * @type {boolean}
	 */
	this.mappedValues = null ;
	
	/**
	 * an url to get the possible values through a REST API.
	 * @type {string}
	 */
	this.restAPIUrl = null ;

	/**
	 * The function that maps each result retreived with the rest API into an element used in auto-completion
	 * @type {function}
	 */
	this.restMapperCallback = null ;

	/**
	 * TODO : to be implemented...
	 * The list of condition types accepted for this attribute
	 * @type {array}
	 */
	this.authorizedConditionTypes = null ;
} ;
