(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('waitingController', WaitingController);

WaitingController.$inject = ['gameService'];
function WaitingController(gameService){
	this.players = gameService.players;
	this.isActive = isActive;
	this.start = gameService.startGame;
	activate();
	
	function activate(){
		
	}
	
	function isActive(){
		return gameService.isConnected() &&
		gameService.phase === gameService.Phases.WAITING;
	}
	
}

})();