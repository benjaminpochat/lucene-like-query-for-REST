describe("parse OData filter", function() {
	var converter = new Converter();
	it("simple attribute filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob")).toEqual("firstName eq 'bob'");
	});

	it("multi-word filter", function() {
		expect(converter.convertNaturalQuery("firstName:\"jean seb\"")).toEqual("firstName eq 'jean seb'");
	});

	it("multi-attribute filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob lastName:marley")).toEqual("firstName eq 'bob' and lastName eq 'marley'");
	});

	it("multi-value filter", function() {
		expect(converter.convertNaturalQuery("firstName:bob,sam")).toEqual("( firstName eq 'bob' or firstName eq 'sam' )");	
	});

	it("minimum filter", function() {
		expect(converter.convertNaturalQuery("creationDate>01012016")).toEqual("creationDate ge '01012016'");	
	});

	it("maximum filter", function() {
		expect(converter.convertNaturalQuery("creationDate<01012016")).toEqual("creationDate le '01012016'");	
	});

	it("range filter", function() {
		expect(converter.convertNaturalQuery("creationDate:[01012016 31122016]")).toEqual("creationDate ge '01012016' and creationDate le '31122016'");	
	});
	//TODO : negation, wildchar...

	it("mixed filter", function() {
		expect(converter.convertNaturalQuery("creationDate:[01012016 31122016] label:\"some like it hot\" modificationDate>01011950 name:Marilyn,Gary")).toEqual("creationDate ge '01012016' and creationDate le '31122016' and label eq 'some like it hot' and modificationDate ge '01011950' and ( name eq 'Marilyn' or name eq 'Gary' )");	
	});
});
