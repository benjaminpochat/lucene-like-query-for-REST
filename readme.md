A  javascript utility to autocomplete and convert queries written in simplistic Lucene query syntax into CXF Query Language.

# Implemented :
* parsing of a simplistic Lucene query syntax including the following patterns :
** `name:jean` (simple equal filter, with no white space) 
** `band:"daft punk"` (equal filter with white spaces) 
** `name:jean,georges,bob` (multivalue, interprated with "or" operator)
** `quantity>3` (greater or equal)
** `quantity<3` (lower or equal) 
** `quantity:[3 10]` (range of values) 
* autocompletion with values given in an array, for mono-value equality filters (with or without white spaces)
* conversion into FIQL format

Try it with the file UISample.html. 

# TODO : 
* autocompletion with values given in an array, for multi-value equality filters (with or without white spaces)
* add a tool like selectize.js, chosen or select2 to glue a condition that has been typed
* conversion into odata filter format
* autocompletion with values given from REST url
* adding tooling to minimize the scripts


# References : 

https://lucene.apache.org/core/3_5_0/queryparsersyntax.html

https://cxf.apache.org/docs/jax-rs-search.html#JAX-RSSearch-SupportedQueryLanguages

https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00

http://docs.oasis-open.org/odata/odata/v4.0/cos01/part2-url-conventions/odata-v4.0-cos01-part2-url-conventions.html#_Toc372793792

http://www.wseas.us/e-library/conferences/2012/Kos/COMCOM/COMCOM-48.pdf

http://events.linuxfoundation.org/sites/events/files/slides/Apache%20CXF%2C%20Tika%20and%20Lucene.pdf
