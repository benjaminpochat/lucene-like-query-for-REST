var NaturalQuery = function ( selector, attributes, restFormat ){
	return new NaturalQueryProcessor ( selector, attributes, restFormat );
};

var NaturalQueryProcessor = function ( selector, attributes, restFormat ) {
	var completer = new Completer(attributes);
		
	/**
	 * Main public function : initialize the input field pointed by the selector
	 */
	this.process = function () {
		var callbackFunction = getPossibleValues ;
		var selectFunction = updateValueAfterSelect ;
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
		return new Converter( selector, attributes, restFormat );
	} ;
	
	/**
	 * Private function to get the possible values, to use as a callback function in the autocomplete JQuery API.
	 * @param {[type]} request the request treated by the callback function
	 * @param {[type]} response
	 */
	function getPossibleValues ( request, response ) {
		console.log( "typed data = " + request.term ) ;
		possibleValues = completer.getPossibleCompletedQueries( request.term ) ;
		response( possibleValues ) ;
	}
	
	/**
	 * Private function to call when a value is selected by the user.
	 * @param {[type]} event
	 * @param {[type]} ui
	 * @return {boolean} always false
	 */
	function updateValueAfterSelect ( event, ui ) {
		var completedString = completer.complete(this.value, ui.item); 
		$(selector).val(completedString);
		return false;		
	}
};