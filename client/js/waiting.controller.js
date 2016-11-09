(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('waitingController', WaitingController);

WaitingController.$inject = ['gameService'];
function WaitingController(gameService){
	var vm = this;
	vm.players = gameService.players;
	vm.getPlayerSettings = gameService.getPlayerSettings;
	vm.isActive = isActive;
	vm.start = startGame;
	activate();
	
	function activate(){
		
	}

	function startGame(){
		gameService.startGame();
		gameService.getCurrentPhase();
	}

	function isActive(){
		return gameService.isConnected() &&
		gameService.getCurrentPhase() === gameService.Phases.WAITING;
	}
	
}

})();