var CONTITION_TYPE_SIMPLE_EQUAL = "CONTITION_TYPE_SIMPLE_EQUAL";
var CONTITION_TYPE_GREATER_OR_EQUAL = "CONTITION_TYPE_GREATER_OR_EQUAL";
var CONTITION_TYPE_LOWER_OR_EQUAL = "CONTITION_TYPE_LOWER_OR_EQUAL";
var CONTITION_TYPE_MULTI_VALUE = "CONTITION_TYPE_MULTI_VALUE";
var CONTITION_TYPE_EQUAL_WITH_WHITESPACES = "CONTITION_TYPE_EQUAL_WITH_WHITESPACES";
var CONTITION_TYPE_RANGE = "CONTITION_TYPE_RANGE";

/**
 * Describes an attribute used in a query.
 */
var Attribute = function(){
	
	// the name of the attribute as it appears in the natural query, seen by users  
	this.naturalName = null ;
	
	// the list of suggested values for the attribute (used only if valuesRetreiverUrl is null)
	this.possibleValues = null ;

	// a boolean to set if the suggested values are given as a key/value map. 
	// default is false
	// if true, the values of the map are suggested to the users, and the keys are used in the REST search api
	this.mappedValues = null ;
	
	// an url to get the possible values through a REST api
	this.restSearchUrl = null ;

	// the name of the attribute in the REST search response with the value displayed to the user
	this.restValueField = null ;

	// the list of condition types accepted for this attribute
	//TODO : to be implemented...
	this.authorizedConditionTypes = null ;
} ;
