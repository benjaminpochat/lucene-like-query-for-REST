/**
 * The RestTokenBuilder provides function to retreive the token used in REST queries.
 * The destination format indicates what format is used : OData or FIQL.
 */

const ODATA = "ODATA";
const FIQL = "FIQL";


var RestTokenBuilder = function( destinationFormat ){
	this.destinationFormat = destinationFormat;

	this.getEqualRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " eq ";
		case FIQL :
			return "==";
		}
		return null;
	} ;
	
	
	this.getGreaterOrEqualRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " ge ";
		case FIQL :
			return "=ge=";
		}
		return null;
	} ;

	this.getLowerOrEqualRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " le ";
		case FIQL :
			return "=le=";
		}
		return null;
	} ;
	
	this.getAndRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " and ";
		case FIQL :
			return ";";
		}
		return null;
	} ;
	
	this.getOrRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " or ";
		case FIQL :
			return ",";
		}
		return null;
	} ;	

	this.getStringDelimiterRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return "'";
		case FIQL :
			return "";
		}
		return null;
	} ;	

	this.getLeftParenthesisRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return "( ";
		case FIQL :
			return "(";
		}
		return null;
	} ;	

	this.getRightParenthesisRestToken = function(){
		switch(this.destinationFormat) {
		case ODATA :
			return " )";
		case FIQL :
			return ")";
		}
		return null;
	} ;	
} ;