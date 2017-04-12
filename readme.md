A  javascript utility to autocomplete and convert queries written in simplified Lucene-like query syntax into a [query language supported by CXF](https://cxf.apache.org/docs/jax-rs-search.html#JAX-RSSearch-SupportedQueryLanguages).

A converter can be initilized in javascript like this :

```javascript
	converter = NaturalQuery(
		"#naturalQuery", 		// the selector of a div where the input will be inserted
		[
			{
				naturalName: "title"	// the name of a filter attribute, without any value
			}, {
				naturalName: "year"		// the name of another attribute, without any value
			}, {
				naturalName: "artist",	// the name of a second filter attribute, with a list of hard-coded possible values
				possibleValues: [
					"daft punk",
					"moriarty",
					"the rolling stones",
					"abba" ]
			}, {
				naturalName: "country" ,	// the name of a third filter attribute, with a list of possible values given by a rest API
				restAPIUrl: "https://restcountries.eu/rest/v2/",	// the url for the rest API
				restMapperCallback: function ( countryJson ) {		// a callback function called to map the API's response into a list of possible values
					return countryJson.name ;
				}
			}, {
				naturalName: "style" ,		// the name of a forth filter attribute, with a list of key/values. The values are displayed to the user, the keys are used in the converted query.
				possibleValues: [
				{key: 1, value: "rock"},
				{key: 2, value: "jazz"},
				{key: 3, value: "musette"},
				{key: 4, value: "classic"},
				{key: 5, value: "electro"}
				] ,
				mappedValues: true
			}
			).process();
```
This code inserts an auto-completed input in the div #naturalQuery.

To convert the natural query typed by the user into a REST query (OData format by default), use this code :
```javascript
converter.convert();
```
It returns a REST query.

For instance, with the example above, the user types that :
`title:"around the world" artist:"daft punk" year:[2000 2017] style:electro`
And the conversion returns this :
`title eq 'around the world' and artist eq 'daft punk' and year gt '2000' and year lt '2017' and style eq '5'`


Try it localy with the examples given in the sample folder in this repo, or or try it online on [jsfiddle.net](https://jsfiddle.net/benjaminpochat/ngpqv0gt/)


# Implemented :
* parsing of a simplified Lucene query syntax including the following patterns :
	* `name:jean` (simple equal filter, with no white space) 
	* `band:"daft punk"` (equal filter with white spaces) 
	* `name:georges,"jean seb",bob` (multivalue, interpreted with "or" operator)
	* `quantity>3` (greater or equal)
	* `quantity<3` (lower or equal) 
	* `quantity:[3 10]` (range of values) 
* autocompletion with values given in an array (with or without white spaces)
* conversion into [odata filter format](http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792)
* conversion into [FIQL filter format](https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00)
* autocompletion with values given from REST url

# TODOs : 
1. enable a default attribute for the conditions with no `title:value` but just `value` 
3. add a tool like selectize.js, chosen or select2 to glue a condition that has been typed


# References : 

https://lucene.apache.org/core/3_5_0/queryparsersyntax.html

https://cxf.apache.org/docs/jax-rs-search.html#JAX-RSSearch-SupportedQueryLanguages

https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00

http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792

http://www.wseas.us/e-library/conferences/2012/Kos/COMCOM/COMCOM-48.pdf

http://events.linuxfoundation.org/sites/events/files/slides/Apache%20CXF%2C%20Tika%20and%20Lucene.pdf
