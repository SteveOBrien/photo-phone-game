(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('guess', guessDirective);

function guessDirective(){
	return {
		restrict: 'EA',
		scope: {},
		controller: 'guessController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/photo_telephone/client/templates/guess.tpl.html'
	};
}

})();