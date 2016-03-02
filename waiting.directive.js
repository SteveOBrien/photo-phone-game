(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('waitingRoom', waitingDirective);

function waitingDirective(){
	var directive = {
		restrict: 'EA',
		scope: {
			players: '='
		},
		controller: 'waitingController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/templates/waiting.tpl.html'
	};
	return directive;
}

})();