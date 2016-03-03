(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('guess', guessDirective);

function guessDirective(){
	var directive = {
		restrict: 'EA',
		scope: {},
		controller: 'guessController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/client/templates/guess.tpl.html'
	};
	return directive;
}

})();