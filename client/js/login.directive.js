(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('login', loginDirective);

function loginDirective(){
	return {
		restrict: 'EA',
		scope: {},
		controller: 'loginController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/photo_telephone/client/templates/login.tpl.html'
	};
}

})();