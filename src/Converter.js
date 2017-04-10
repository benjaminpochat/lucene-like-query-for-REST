/**
 * A Converter responsible for converting a natural query into a REST query (in FIQL format).
 * 
 * Depending on the destinationFormat ("ODATA" or "FIQL"), the REST query is formatted as :
 * - a OData query : http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792
 * - or a FIQL query : https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00
 * 
 * If destinationFormat is not defined, OData format is used.
 * 
 */

var Converter = function( selector , attributes , destinationFormat){
	this.destinationFormat = destinationFormat == undefined ? ODATA : destinationFormat; 
	this.restTokenBuilder = new RestTokenBuilder(this.destinationFormat);
	this.attributes = attributes;
	this.parser = new Parser();

	/**
	 * Main function : converts the natural query which is the value of input field pointed by the selector
	 */
	this.convert = function() {
		var naturalQuery = $( selector ).val();
		return this.convertNaturalQuery(naturalQuery);
	}
	
	/**
	 * Function to call to convert the natural query into REST query.
	 */
	this.convertNaturalQuery = function( naturalQuery ) {
		var naturalConditions = this.parser.splitConditions( naturalQuery );
		var restQuery = "";
		for ( var i = 0 ; i < naturalConditions.length ; i++ ) {
			if(i == 0){
				restQuery = this.convertNaturalCondition( naturalConditions[i] );
			}else{
				restQuery = restQuery + this.restTokenBuilder.getAndRestToken() + this.convertNaturalCondition( naturalConditions[i] );			
			}
		}
		return restQuery;
	};
	
	this.convertNaturalCondition = function( naturalCondition ) {
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.SIMPLE_EQUAL_PATTERN))){
			return this.convertSimpleEqualCondition(naturalCondition);
		}
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.EQUAL_WITH_WHITE_SPACE_PATTERN))){
			return this.convertEqualConditionWhiteSpace(naturalCondition);
		}
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.MULTI_VALUE_PATTERN))){
			return this.convertMultiValueCondition(naturalCondition);
		}
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.GREATER_OR_EQUAL_PATTERN))){
			return this.convertGreaterOrEqualThanCondition(naturalCondition);
		}
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.LOWER_OR_EQUAL_PATTERN))){
			return this.convertLowerOrEqualThanCondition(naturalCondition);
		}
		if(naturalCondition.match(this.parser.buildConditionRegExp(this.parser.RANGE_PATTERN))){
			return this.convertRangeCondition(naturalCondition);
		}
	};

	this.convertSimpleEqualCondition = function( naturalCondition ){
		return this.convertSimpleCondition( naturalCondition, ":", this.restTokenBuilder.getEqualRestToken() );
	};

	this.convertGreaterOrEqualThanCondition = function( naturalCondition ){
		return this.convertSimpleCondition( naturalCondition, ">", this.restTokenBuilder.getGreaterOrEqualRestToken() );
	};

	this.convertLowerOrEqualThanCondition = function( naturalCondition ){
		return this.convertSimpleCondition(naturalCondition, "<", this.restTokenBuilder.getLowerOrEqualRestToken());
	};
	
	this.convertSimpleCondition = function( 
			naturalCondition, 
			naturalConditionOperator, 
			restConditionOperator ){
		var separatorIndex = naturalCondition.indexOf( naturalConditionOperator) ;
		var attributeName = naturalCondition.substring( 0, separatorIndex ) ;
		var naturalValue = naturalCondition.substring( separatorIndex+1 ) ;
		var restValue = this.getRestValue( attributeName, naturalValue ) ;
		return attributeName + restConditionOperator + restValue;	
	};

	this.getAttribute = function( attributeName ){
		if ( this.attributes == undefined || this.attributes == null ) {
			return null ;
		}
		for ( i = 0 ; i < this.attributes.length ; i++ ) {
			if ( this.attributes[i].naturalName == attributeName ) {
				return this.attributes[i] ;
			}
		}
	}
	
	this.getRestValue = function ( attributeName, naturalValue ) {
		var attribute = this.getAttribute( attributeName ) ;
		var restValue ;
		if(attribute == undefined || attribute == null ) {
			restValue =  naturalValue ;
		}
		else if ( ! attribute.mappedValues ) {
			restValue = naturalValue ;
		} else {
			for ( i = 0 ; i < attribute.possibleValues.length ; i++ ) {
				if ( attribute.possibleValues[i].value == naturalValue ) {
					restValue = attribute.possibleValues[i].key ;
				}
			}
		}
		
		return this.restTokenBuilder.getStringDelimiterRestToken() + restValue + this.restTokenBuilder.getStringDelimiterRestToken() ;
	};
	
	this.convertMultiValueCondition = function( naturalCondition ){
		var separatorIndex = naturalCondition.indexOf(":");
		var searchAttribute = naturalCondition.substring(0, separatorIndex);
		var searchMultiValues = naturalCondition.substring(separatorIndex+1).split(",");
		var restCondition = this.restTokenBuilder.getLeftParenthesisRestToken();
		for (var i = 0 ; i < searchMultiValues.length ; i++){
			if (i > 0){
				restCondition += this.restTokenBuilder.getOrRestToken() ;
			}
			restCondition += searchAttribute 
				+ this.restTokenBuilder.getEqualRestToken() 
				+ this.restTokenBuilder.getStringDelimiterRestToken() 
				+ searchMultiValues[i]
				+ this.restTokenBuilder.getStringDelimiterRestToken();
		}
		restCondition += this.restTokenBuilder.getRightParenthesisRestToken();
		return restCondition;
	};

	this.convertEqualConditionWhiteSpace = function( naturalCondition ){
		var separatorIndex = naturalCondition.indexOf(":");
		var searchAttribute = naturalCondition.substring(0, separatorIndex);
		var searchValueWithSpace = naturalCondition.substring(separatorIndex+2);
		var searchValueWithSpace = searchValueWithSpace.substring(0, searchValueWithSpace.length - 1);
		var restCondition = 
			searchAttribute 
			+ this.restTokenBuilder.getEqualRestToken() 
			+ this.getRestValue( searchAttribute , searchValueWithSpace );
		return restCondition;
	};

	this.convertRangeCondition = function( naturalCondition ) {
		var separatorIndex = naturalCondition.indexOf(":") ;
		var searchAttribute = naturalCondition.substring(0, separatorIndex) ;
		var rangeValues = naturalCondition.substring(separatorIndex+2) ;
		var rangeValues = rangeValues.substring(0, rangeValues.length - 1) ;
		var rangeValuesArray = rangeValues.split(" ") ;
		var restCondition = 
			searchAttribute 
			+ this.restTokenBuilder.getGreaterOrEqualRestToken() 
			+ this.restTokenBuilder.getStringDelimiterRestToken() 
			+ rangeValuesArray[0] 
			+ this.restTokenBuilder.getStringDelimiterRestToken() 
			+ this.restTokenBuilder.getAndRestToken() 
			+ searchAttribute 
			+ this.restTokenBuilder.getLowerOrEqualRestToken() 
			+ this.restTokenBuilder.getStringDelimiterRestToken() 
			+ rangeValuesArray[1]
			+ this.restTokenBuilder.getStringDelimiterRestToken() ;
		return restCondition ;
	};	
};
