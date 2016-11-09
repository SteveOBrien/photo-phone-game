(function(){
'use strict';
angular.module('photoTelephoneApp').
controller('loginController', LoginController);

LoginController.$inject = ['gameService'];
function LoginController(gameService){
	var vm = this;
	vm.connect = connect;
	vm.isConnected = gameService.isConnected;
	vm.STATES = Object.freeze({
		DEFAULT : 0,
		JOINING : 1,
		HOSTING : 2
	});
	vm.state = vm.STATES.DEFAULT;

	function connect(user, room){
		if (vm.state === vm.STATES.HOSTING) {
			gameService.connect(vm.name);
		}
		else{
			gameService.connect(vm.name, vm.room);
		}
	}

}

})();