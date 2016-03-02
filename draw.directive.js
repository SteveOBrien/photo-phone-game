(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('draw', guessDirective);

function guessDirective(){
	var directive = {
		restrict: 'EA',
		scope: {},
		controller: 'drawController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/templates/draw.tpl.html'
	};
	return directive;
}

})();