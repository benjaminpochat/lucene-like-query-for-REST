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
	this.naturalName ;
	
	// the list of suggested values for the attribute (used only if valuesRetreiverUrl is null)
	this.possibleValues ;

	// a boolean to set if the suggested values are given as a key/value map. 
	// default is false
	// if true, the values of the map are suggested to the users, and the keys are used in the REST search api
	//TODO : to be implemented
	//QUESTION : what if the value typed by the user doesn't match any key ?
	//- an error is shown to the user ? => BEST (just as any other syntax error, eg if an attribute is typed but does not exist)
	//- the attribute is ignored ? => NO
	//- the condition is always false ? => ACCEPTABLE
	this.mappedValues ;
	
	// the name of the attribute in the REST search api (which can be different from the natural seen by the users)
	//TODO : to be implemented...
	this.restName ;
		
	// an url to get the possible values through a REST api
	//TODO : to be implemented...
	this.valuesRetreiverUrl ;

	// the list of condition types accepted for this attribute
	//TODO : to be implemented...
	this.authorizedConditionTypes ;
}
