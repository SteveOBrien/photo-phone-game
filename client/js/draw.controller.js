(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('drawController', DrawController);

DrawController.$inject = ['gameService', '$element', '$timeout'];
function DrawController(gameService, $element, $timeout){
	var vm = this;
	var canvas = $element.find('canvas')[0];
	var canvasResized = false;
	vm.players = gameService.players;
	vm.isActive = isActive;
	vm.getGuess = gameService.getCurrentGuess;
	vm.submit = submit;
	vm.submitted = false;
	vm.clear = clear;

	function submit(){
		gameService.submitDrawing(canvas.toDataURL());
		vm.submitted = true;
	}

	function clear(){
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function isActive(){
		var isActive = gameService.isConnected() &&
		gameService.getCurrentPhase() === gameService.Phases.DRAWING;

		if (!isActive) {
			vm.submitted = false;
		}
		else if(!canvasResized){
			$timeout(resizeCanvas);
			canvasResized = true;
		}

		return isActive;
	}

	var optimizedResize = (function() {

		var callbacks = [],
			running = false;

		// fired on resize event
		function resize() {

			if (!running) {
				running = true;

				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(runCallbacks);
				} else {
					setTimeout(runCallbacks, 66);
				}
			}

		}

		// run the actual callbacks
		function runCallbacks() {

			callbacks.forEach(function(callback) {
				callback();
			});

			running = false;
		}

		// adds callback to loop
		function addCallback(callback) {

			if (callback) {
				callbacks.push(callback);
			}

		}

		return {
			// public method to add additional callback
			add: function(callback) {
				if (!callbacks.length) {
					window.addEventListener('resize', resize);
				}
				addCallback(callback);
			}
		}
	}());

	optimizedResize.add(resizeCanvas);

	function resizeCanvas(){
		var heightAdjust = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - document.body.offsetHeight;
		canvas.width = canvas.parentNode.offsetWidth;
		canvas.height = canvas.height + heightAdjust;
	}

}

})();