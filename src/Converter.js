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
var Converter = function ( selector , attributes , destinationFormat ) {
    destinationFormat = destinationFormat === undefined ? ODATA : destinationFormat ; 
    var restTokenBuilder = new RestTokenBuilder( destinationFormat ) ;
    var parser = new Parser() ;

    /**
     * Main public function : converts the natural query which is the value of input field pointed by the selector.
     * @return {string} a REST query built from the natural query
     */
    this.convert = function() {
        var naturalQuery = $( selector ).val() ;
        return this.convertNaturalQuery( naturalQuery ) ;
    } ;
    
    /**
     * Public function to call to convert the natural query into REST query.
     * @param {string} naturalQuery the query typed by the user to convert into a REST format
     * @return {string} a REST query built from the natural query
     */
    this.convertNaturalQuery = function ( naturalQuery ) {
        var naturalConditions = parser.splitConditions( naturalQuery );
        var restQuery = "";
        for ( var i = 0 ; i < naturalConditions.length ; i++ ) {
            if(i === 0){
                restQuery = convertNaturalCondition( naturalConditions[i] );
            }else{
                restQuery = restQuery + restTokenBuilder.getAndRestToken() + convertNaturalCondition( naturalConditions[i] );           
            }
        }
        return restQuery;
    } ;
    
    /**
     * Private function to convert a natural condition (which is a part of the natural query) into a REST formatted query.
     * @param  {string} naturalCondition the condition to convert (for example : "country:Canada")
     * @return {string} the condition formatted into a REST format (for example : "country eq 'Canada'" for OData format, for "country==Canada" for FIQL).
     */
    function convertNaturalCondition ( naturalCondition ) {
        if(naturalCondition.match(parser.buildConditionRegExp(parser.SIMPLE_EQUAL_PATTERN))){
            return convertSimpleEqualCondition(naturalCondition);
        }
        if(naturalCondition.match(parser.buildConditionRegExp(parser.EQUAL_WITH_WHITE_SPACE_PATTERN))){
            return convertEqualConditionWhiteSpace(naturalCondition);
        }
        if(naturalCondition.match(parser.buildConditionRegExp(parser.MULTI_VALUE_PATTERN))){
            return convertMultiValueCondition(naturalCondition);
        }
        if(naturalCondition.match(parser.buildConditionRegExp(parser.GREATER_OR_EQUAL_PATTERN))){
            return convertGreaterOrEqualThanCondition(naturalCondition);
        }
        if(naturalCondition.match(parser.buildConditionRegExp(parser.LOWER_OR_EQUAL_PATTERN))){
            return convertLowerOrEqualThanCondition(naturalCondition);
        }
        if(naturalCondition.match(parser.buildConditionRegExp(parser.RANGE_PATTERN))){
            return convertRangeCondition(naturalCondition);
        }
    }

    /**
     * Private function to convert an equality condition with one value.
     * @param  {string} naturalCondition simple equality natural condition
     * @return {string} the condition converted 
     */
    function convertSimpleEqualCondition ( naturalCondition ) {
        return convertSimpleCondition( naturalCondition, ":", restTokenBuilder.getEqualRestToken() );
    }

    /**
     * Private function to convert a "greater or equal" condition.
     * @param  {string} naturalCondition "greater or equal" natural condition
     * @return {string} the condition converted
     */
    function convertGreaterOrEqualThanCondition ( naturalCondition ) {
        return convertSimpleCondition( naturalCondition, ">", restTokenBuilder.getGreaterOrEqualRestToken() );
    }

    /**
     * Private function to convert a "lower or equal" condition.
     * @param  {string} naturalCondition "lower or equal" natural condition
     * @return {string} the condition converted
     */
    function convertLowerOrEqualThanCondition ( naturalCondition ) {
        return convertSimpleCondition(naturalCondition, "<", restTokenBuilder.getLowerOrEqualRestToken());
    }
    
    /**
     * Private function to convert condition with one unique value.
     * @param  {string} naturalCondition the natural condition to convert
     * @param  {string} naturalConditionOperator the operator that defines the type of condition (":", ">", "<", etc...)
     * @param  {string} restConditionOperator the boolean operator that links the current condition to the previous one 
     * @return {[type]}
     */
    function convertSimpleCondition ( 
            naturalCondition, 
            naturalConditionOperator, 
            restConditionOperator ) {
        var separatorIndex = naturalCondition.indexOf( naturalConditionOperator) ;
        var attributeName = naturalCondition.substring( 0, separatorIndex ) ;
        var naturalValue = naturalCondition.substring( separatorIndex + 1 ) ;
        var restValue = getRestValue( attributeName, naturalValue ) ;
        return attributeName + restConditionOperator + restValue ;  
    }

    /**
     * Private function to get an Attribute instance from an attribute name.
     * @param  {string} attributeName the name of the attribute
     * @return {Attribute} the attribute tha matches with the attribute name
     */
    function getAttribute ( attributeName ) {
        if ( attributes === undefined || attributes === null ) {
            return null ;
        }
        for ( i = 0 ; i < attributes.length ; i++ ) {
            if ( attributes[i].naturalName == attributeName ) {
                return attributes[i] ;
            }
        }
    }

    /**
     * Private function that returns the value to be put into the REST query.
     * @param  {string} attributeName the name of the attribute 
     * @param  {string} naturalValue the value typed by the user
     * @return {string} if the attrbute is in a key/value format, returns the key that matches with the value. Else, return the value.
     */
    function getRestValue ( attributeName, naturalValue ) {
        var attribute = getAttribute( attributeName ) ;
        var restValue ;
        if(attribute === undefined || attribute === null ) {
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
        
        return restTokenBuilder.getStringDelimiterRestToken() + restValue + restTokenBuilder.getStringDelimiterRestToken() ;
    }
    
    /**
     * Private function to convert condition with several values.
     * @param  {string} naturalCondition the natural condition to convert
     * @return {string} the multi value condition converted into a REST format.
     */
    function convertMultiValueCondition ( naturalCondition ) {
        var separatorIndex = naturalCondition.indexOf(":");
        var searchAttribute = naturalCondition.substring(0, separatorIndex);
        var searchMultiValues = naturalCondition.substring(separatorIndex+1).split(",");
        var restCondition = restTokenBuilder.getLeftParenthesisRestToken();
        for (var i = 0 ; i < searchMultiValues.length ; i++){
            var monoValueCondition = searchAttribute + ":" + searchMultiValues[i] ;
            var searchMonoValue ;
            if (monoValueCondition.match(parser.buildConditionRegExp(parser.EQUAL_WITH_WHITE_SPACE_PATTERN))) {
                // if it looks like attribute:"multi word condition", then de double-quotes should be removed
                searchMonoValue = searchMultiValues[i].substring(1, searchMultiValues[i].length - 1);
            } else {
                // if it looks like attribute:oneWordCondition, then the value can be used without any modification
                searchMonoValue = searchMultiValues[i] ;
            }
            if (i > 0){
                restCondition += restTokenBuilder.getOrRestToken() ;
            }
            restCondition += searchAttribute + 
                restTokenBuilder.getEqualRestToken() + 
                restTokenBuilder.getStringDelimiterRestToken() + 
                searchMonoValue + 
                restTokenBuilder.getStringDelimiterRestToken();
        }
        restCondition += restTokenBuilder.getRightParenthesisRestToken();
        return restCondition;
    }

    /**
     * Private function to convert an equal condition where the value contains white spaces.
     * @param  {string} naturalCondition the natural condition to convert
     * @return {string} the condition converted into a REST format
     */
    function convertEqualConditionWhiteSpace ( naturalCondition ) {
        var separatorIndex = naturalCondition.indexOf(":");
        var searchAttribute = naturalCondition.substring(0, separatorIndex);
        var searchValueWithSpace = naturalCondition.substring(separatorIndex+2);
        searchValueWithSpace = searchValueWithSpace.substring(0, searchValueWithSpace.length - 1);
        var restCondition = 
            searchAttribute + 
            restTokenBuilder.getEqualRestToken() + 
            getRestValue( searchAttribute , searchValueWithSpace );
        return restCondition;
    }

    /**
     * Private function to convert a condition that represents a range of values (for example "dateOfBirth:[01/01/1980 31/12/1980]").
     * @param  {string} naturalCondition a range natural condition to convert
     * @return {string} the condition converted into a REST format 
     */
    function convertRangeCondition ( naturalCondition ) {
        var separatorIndex = naturalCondition.indexOf( ":" ) ;
        var searchAttribute = naturalCondition.substring( 0 , separatorIndex ) ;
        var rangeValues = naturalCondition.substring( separatorIndex + 2 ) ;
        rangeValues = rangeValues.substring( 0 , rangeValues.length - 1 ) ;
        var rangeValuesArray = rangeValues.split(" ") ;
        var restCondition = 
            searchAttribute + 
            restTokenBuilder.getGreaterOrEqualRestToken() + 
            restTokenBuilder.getStringDelimiterRestToken() + 
            rangeValuesArray[0] + 
            restTokenBuilder.getStringDelimiterRestToken() + 
            restTokenBuilder.getAndRestToken() + 
            searchAttribute + 
            restTokenBuilder.getLowerOrEqualRestToken() + 
            restTokenBuilder.getStringDelimiterRestToken() + 
            rangeValuesArray[1] + 
            restTokenBuilder.getStringDelimiterRestToken() ;
        return restCondition ;
    }
} ;

