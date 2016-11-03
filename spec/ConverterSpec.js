describe("parse fiql filter", function() {
	var converter = new Converter();
	it("simple attribute filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob")).toEqual("firstName==bob");
	});

	it("multi-word filter", function() {
		expect(converter.convertNaturalQuery("firstName:\"jean seb\"")).toEqual("firstName==jean seb");
	});

	it("multi-attribute filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob lastName:marley")).toEqual("firstName==bob;lastName==marley");
	});

	it("multi-value filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob,sam")).toEqual("(firstName==bob,firstName==sam)");	
	});

	it("minimum filter", function() {
		expect(converter.convertNaturalQuery("creationDate>01012016")).toEqual("creationDate=ge=01012016");	
	});

	it("maximum filter", function() {
		expect(converter.convertNaturalQuery("creationDate<01012016")).toEqual("creationDate=le=01012016");	
	});

	it("range filter", function() {
		expect(converter.convertNaturalQuery("creationDate:[01012016 31122016]")).toEqual("creationDate=ge=01012016;creationDate=le=31122016");	
	});
	//TODO : negation, wildchar...

	it("mixed filter", function() {
		expect(converter.convertNaturalQuery("creationDate:[01012016 31122016] label:\"some like it hot\" modificationDate>01011950 name:Marilyn,Gary")).toEqual("creationDate=ge=01012016;creationDate=le=31122016;label==some like it hot;modificationDate=ge=01011950;(name==Marilyn,name==Gary)");	
	});

});