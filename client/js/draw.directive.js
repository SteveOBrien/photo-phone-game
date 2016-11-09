(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('draw', guessDirective);

function guessDirective(){
	return {
		restrict: 'EA',
		scope: {},
		controller: 'drawController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/photo_telephone/client/templates/draw.tpl.html'
	};
	
}

})();