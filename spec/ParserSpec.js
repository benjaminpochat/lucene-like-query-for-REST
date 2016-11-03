describe("split conditions", function() {
	
	var parser = new Parser();
	
	it("split simple conditions", function() {
		expect(parser.splitConditions("firstName:bob lastName:sam")).toEqual(["firstName:bob", "lastName:sam"]);
	});
});	

describe("is last token an attribute name", function() {

	var parser = new Parser();

	it("is last token an attribute name : case true on first conditon", function() {
		expect(parser.isLastTokenAttributeName("first")).toEqual(true);
	});

	it("is last token an attribute name : case false on first conditon", function() {
		expect(parser.isLastTokenAttributeName("firstName:bo")).toEqual(false);
	});

	it("is last token an attribute name : case true before second conditon", function() {
		expect(parser.isLastTokenAttributeName("firstName:bob ")).toEqual(true);
	});

	it("is last token an attribute name : case true on second conditon", function() {
		expect(parser.isLastTokenAttributeName("firstName:bob last")).toEqual(true);
	});

	it("is last token an attribute name : case false on second conditon", function() {
		expect(parser.isLastTokenAttributeName("firstName:bob lastName:sa")).toEqual(false);
	});

	it("is last token an attribute name : case true on second conditon with white space on first condition", function() {
		expect(parser.isLastTokenAttributeName("firstName:\"jean seb\" last")).toEqual(true);
	});

	it("is last token an attribute name : case false on second conditon with white space on first condition", function() {
		expect(parser.isLastTokenAttributeName("firstName:\"jean seb\" lastName:sa")).toEqual(false);
	});

	it("is last token an attribute name : case true on second conditon with white space on first and second condition", function() {
		expect(parser.isLastTokenAttributeName("firstName:\"jean seb\" lastName:\"de la font")).toEqual(false);
	});
});

describe("get last condition currently typed", function() {

	var parser = new Parser();

	it("get last condition currently typed : case first conditon at attribute name", function() {
		expect(parser.getLastConditionCurrentlyTyped("first")).toEqual("first");
	});
	
	it("get last condition currently typed : case first conditon at attribute value", function() {
		expect(parser.getLastConditionCurrentlyTyped("firstName:bob")).toEqual("firstName:bob");
	});

	it("get last condition currently typed : case second conditon at attribute name", function() {
		expect(parser.getLastConditionCurrentlyTyped("firstName:bob last")).toEqual("last");
	});

	it("get last condition currently typed : case second conditon at attribute value", function() {
		expect(parser.getLastConditionCurrentlyTyped("firstName:bob lastName:dylan")).toEqual("lastName:dylan");
	});

	it("get last condition currently typed : case second conditon at attribute name with white space on first condition", function() {
		expect(parser.getLastConditionCurrentlyTyped("firstName:\"jean seb\" lastName:dylan")).toEqual("lastName:dylan");
	});
	
	it("get last condition currently typed : case first conditon at attribute value with open bracket", function() {
		expect(parser.getLastConditionCurrentlyTyped("date:[01012016")).toEqual("date:[01012016");
	});

	it("get last condition currently typed : case first conditon at attribute value with closed bracket", function() {
		expect(parser.getLastConditionCurrentlyTyped("date:[01012016 31012016]")).toBeUndefined();
	});

});
