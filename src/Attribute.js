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
	this.naturalName;
	this.valuesRetreiverUrl;
	this.restName;
	this.valueFormat;
	this.authorizedConditionTypes;
	this.possibleValues;
}

Attribute.prototype.valueFormat = /\w+/g;
Attribute.prototype.authorizedConditionTypes = [CONTITION_TYPE_SIMPLE_EQUAL];

