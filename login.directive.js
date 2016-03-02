(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('login', loginDirective);

function loginDirective(){
	var directive = {
		restrict: 'EA',
		scope: {},
		controller: 'loginController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/templates/login.tpl.html'
	};
	return directive;
}

})();