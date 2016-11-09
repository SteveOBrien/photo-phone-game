(function(){
'use strict';
angular.module('photoTelephoneApp').
directive('results', resultsDirective);

function resultsDirective(){
	return {
		restrict: 'EA',
		scope: {},
		controller: 'resultsController',
		controllerAs: 'ctrl',
		bindToController: true,
		templateUrl: '/photo_telephone/client/templates/results.tpl.html'
	};
}

})();