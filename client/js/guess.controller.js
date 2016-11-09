(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('guessController', GuessController);

GuessController.$inject = ['gameService'];
function GuessController(gameService){
	var vm = this;
	vm.players = gameService.players;
	vm.isActive = isActive;
	vm.submit = submit;
	vm.guess = "";
	vm.getDrawing = gameService.getCurrentDrawing;
	vm.isStart = isStart();
	vm.submitted = false;

	function submit(){
		gameService.submitText(vm.guess);
		vm.submitted = true;
	}

	function reset(){
		vm.submitted = false;
		vm.guess = "";
	}

	function isStart(){
		return gameService.getCurrentPhase() === gameService.Phases.START;
	}

	function isActive(){
		var isActive = gameService.isConnected() &&
			(gameService.getCurrentPhase() === gameService.Phases.START ||
			gameService.getCurrentPhase() === gameService.Phases.GUESSING);
		if(!isActive && vm.submitted){
			reset();
		}
		return isActive;
	}
	
}

})();