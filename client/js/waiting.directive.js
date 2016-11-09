(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('waitingRoom', waitingDirective);

function waitingDirective(){
	return {
		restrict: 'EA',
		scope: {
			players: '='
		},
		controller: 'waitingController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/photo_telephone/client/templates/waiting.tpl.html'
	};
}

})();