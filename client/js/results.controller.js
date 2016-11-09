(function () {
    'use strict';
    angular.module('photoTelephoneApp').controller('resultsController', ResultsController);

    ResultsController.$inject = ['gameService', '$element', '$timeout'];

    function ResultsController(gameService, $element, $timeout) {

        var vm = this;
        var currentPlayerIndex = -1;
        var printableElement = $element[0].ownerDocument.getElementById('printable');
        var previousState = isActive();
        vm.isActive = isActive;
        vm.getResults = gameService.getResults;
        vm.currentKey = null;
        vm.switchViewedResult = switchViewedResult;
        vm.printUrl = '';
        vm.getResultsFileName = getResultsFileName;


        function isActive() {
            var isActive = gameService.isConnected() &&
                gameService.getCurrentPhase() === gameService.Phases.END;
            if (isActive && vm.currentKey === null) {
                vm.currentKey = gameService.getPlayerSettings().username;
                currentPlayerIndex = gameService.players.indexOf(gameService.getPlayerSettings().username);
            }
            if (!previousState && isActive) {
                refreshPrintableUrl();
            }
            previousState = isActive;
            return isActive
        }

        /**
         * Switches the currently selected result key
         * @param {number} change The player index increase/decrease
         */
        function switchViewedResult(change) {
            currentPlayerIndex += change;
            if (currentPlayerIndex >= gameService.players.length) {
                currentPlayerIndex = 0;
            }
            else if (currentPlayerIndex < 0) {
                currentPlayerIndex = gameService.players.length - 1;
            }

            vm.currentKey = gameService.players[currentPlayerIndex];
            refreshPrintableUrl();
        }

        /**
         * Generates the printUrl for the currently visible canvas element
         */
        function refreshPrintableUrl() {
            html2canvas(printableElement, {
                onrendered: function (canvas) {
                    $timeout(function () {
                        vm.printUrl = canvas.toDataURL();
                    }, 0);
                }
            })
        }

        /**
         * Generates the file name to use when saving results as an image
         * @returns {string} The generated file name
         */
        function getResultsFileName() {
            return 'pp_' + vm.currentKey + '_' + vm.getResults()[vm.currentKey][0].data + '.png';
        }
    }

})();