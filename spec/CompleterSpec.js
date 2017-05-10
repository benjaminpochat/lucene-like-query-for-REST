describe("complete attributes", function() {
    
    var attributes = [{
            naturalName: "title"
        }, {
            naturalName: "year"
        }, {
            naturalName: "artist",
            possibleValues: [
                "daft punk",
                "moriarty",
                "the rolling stones",
                "abba",
                "electro deluxe"]
        }] ;

    var completer = new Completer( attributes ) ;
    
    it("complete simple attribute", function() {
        possibleCompletedQueries = completer.getPossibleCompletedQueries( "ar" ) ;
        expect( possibleCompletedQueries.length ).toEqual( 2 ) ;
        expect( possibleCompletedQueries.indexOf("year") >= 0 ).toBe(true) ;
        expect( possibleCompletedQueries.indexOf("artist") >= 0 ).toBe(true) ;
    });

    it("complete simple value", function() {
        possibleCompletedQueries = completer.getPossibleCompletedQueries( "artist:ro" ) ;
        expect( possibleCompletedQueries.length ).toEqual( 2 ) ;
        expect( possibleCompletedQueries.indexOf("the rolling stones") >= 0 ).toBe(true) ;
        expect( possibleCompletedQueries.indexOf("electro deluxe") >= 0 ).toBe(true) ;
    });
});