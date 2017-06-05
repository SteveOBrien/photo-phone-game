(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('guessController', GuessController);

GuessController.$inject = ['gameService'];
function GuessController(gameService){
	this.players = gameService.players;
	this.isActive = isActive;
	this.start = gameService.startGame;
	activate();
	
	function activate(){
		
	}
	
	function isActive(){
		return gameService.isConnected() &&
		(gameService.phase === gameService.Phases.START ||
		gameService.phase === gameService.Phases.GUESSING);
	}
	
}

})();