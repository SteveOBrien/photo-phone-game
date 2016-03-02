(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('drawController', DrawController);

DrawController.$inject = ['gameService'];
function DrawController(gameService){
	this.players = gameService.players;
	this.isActive = isActive;
	this.start = gameService.startGame;
	activate();
	
	function activate(){
		
	}
	
	function isActive(){
		return gameService.isConnected() &&
		gameService.phase === gameService.Phases.DRAWING;
	}
	
}

})();