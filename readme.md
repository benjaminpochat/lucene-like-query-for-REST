A  javascript utility to autocomplete and convert queries written in simplistic Lucene-like query syntax into a [query language supported by CXF](https://cxf.apache.org/docs/jax-rs-search.html#JAX-RSSearch-SupportedQueryLanguages).

# Implemented :
* parsing of a simplistic Lucene query syntax including the following patterns :
	* `name:jean` (simple equal filter, with no white space) 
	* `band:"daft punk"` (equal filter with white spaces) 
	* `name:georges,"jean seb",bob` (multivalue, interpreted with "or" operator)
	* `quantity>3` (greater or equal)
	* `quantity<3` (lower or equal) 
	* `quantity:[3 10]` (range of values) 
* autocompletion with values given in an array (with or without white spaces)
* conversion into [FIQL filter format](https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00)

Try it localy with the file UISample.html in this repo, or or try it online on [jsfiddle.net](https://jsfiddle.net/benjaminpochat/ngpqv0gt/)

# TODOs : 
1. enable a default attribute for the conditions with no `title:value` but just `value` 
2. autocompletion with values given from REST url
3. conversion into [odata filter format](http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792)
4. add a tool like selectize.js, chosen or select2 to glue a condition that has been typed


# References : 

https://lucene.apache.org/core/3_5_0/queryparsersyntax.html

https://cxf.apache.org/docs/jax-rs-search.html#JAX-RSSearch-SupportedQueryLanguages

https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00

http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792

http://www.wseas.us/e-library/conferences/2012/Kos/COMCOM/COMCOM-48.pdf

http://events.linuxfoundation.org/sites/events/files/slides/Apache%20CXF%2C%20Tika%20and%20Lucene.pdf
