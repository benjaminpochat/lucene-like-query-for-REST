const ODATA = "ODATA";
const FIQL = "FIQL";

/**
 * The RestTokenBuilder provides function to retreive the token used in REST queries.
 * The destination format indicates what format is used : OData or FIQL.
 */
var RestTokenBuilder = function( destinationFormat ){

	/**
	 * Public function that get the "equal" token in the REST format
	 * @return {string} the "equal" token in the REST format
	 */
	this.getEqualRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " eq ";
		case FIQL :
			return "==";
		}
		return null;
	} ;
	
	/**
	 * Public function that get the "greater or equal" token in the REST format
	 * @return {string} the "greater or equal" token in the REST format
	 */
	this.getGreaterOrEqualRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " ge ";
		case FIQL :
			return "=ge=";
		}
		return null;
	} ;

	/**
	 * Public function that get the "lower or equal" token in the REST format
	 * @return {string} the "lower or equal" token in the REST format
	 */
	this.getLowerOrEqualRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " le ";
		case FIQL :
			return "=le=";
		}
		return null;
	} ;
	
	/**
	 * Public function that get the "and" token in the REST format
	 * @return {string} the "and" token in the REST format
	 */
	this.getAndRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " and ";
		case FIQL :
			return ";";
		}
		return null;
	} ;
	
	/**
	 * Public function that get the "or" token in the REST format
	 * @return {string} the "or" token in the REST format
	 */
	this.getOrRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " or ";
		case FIQL :
			return ",";
		}
		return null;
	} ;	

	/**
	 * Public function that get the string delimiter token in the REST format
	 * @return {string} the string delimiter token in the REST format
	 */
	this.getStringDelimiterRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return "'";
		case FIQL :
			return "";
		}
		return null;
	} ;	

	/**
	 * Public function that get the left parenthesis token in the REST format
	 * @return {string} the left parenthesis token in the REST format
	 */
	this.getLeftParenthesisRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return "( ";
		case FIQL :
			return "(";
		}
		return null;
	} ;	

	/**
	 * Public function that get the right parenthesis token in the REST format
	 * @return {string} the right parenthesis token in the REST format
	 */
	this.getRightParenthesisRestToken = function(){
		switch(destinationFormat) {
		case ODATA :
			return " )";
		case FIQL :
			return ")";
		}
		return null;
	} ;	
} ;