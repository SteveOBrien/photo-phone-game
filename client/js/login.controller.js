(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('loginController', LoginController);

LoginController.$inject = ['gameService'];
function LoginController(gameService){
	this.login = gameService.login;
	this.isConnected = gameService.isConnected;
}

})();