var NaturalQuery = function ( selector, attributes ){
	var selector = selector;
	var attributes = attributes;
	return new NaturalQueryProcessor ( selector, attributes );
};

var NaturalQueryProcessor = function ( selector, attributes ) {
	var selector = selector;
	var completer = new Completer(attributes);
		
	this.process = function () {
		// main function :
		var callbackFunction = this.getPossibleValues;
		var selectFunction = this.updateValueAfterSelect
		$(function() {
			$( selector ).autocomplete({
				position: { my : "right top", at: "right bottom" },
				source: callbackFunction,
				select: selectFunction,
				focus: function() {
					// prevent value inserted on focus
					return false;
				}
			});
		});
	};
	
	this.getPossibleValues = function (request, response) {
		console.log("typed data = " + request.term);
		possibleValues = completer.getPossibleCompletedQueries(request.term);
		response(possibleValues);
	};
	
	this.updateValueAfterSelect = function( event, ui ){
		var completedString = completer.complete(this.value, ui.item); 
		$(selector).val(completedString);
		return false;		
	}
	
};