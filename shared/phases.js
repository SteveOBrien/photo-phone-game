(function () {

    var PHASES = {
        WAITING: 0,
        START: 1,
        DRAWING: 2,
        GUESSING: 3,
        END: 4
    };

    //Change how the const is stored based on the target environment
    if (typeof angular !== typeof undefined) {
        angular.module('photoTelephoneApp')
            .constant('PHASES',
                PHASES);
    }
    else if (typeof module !== typeof undefined) {
        module.exports = PHASES;
    }

}());