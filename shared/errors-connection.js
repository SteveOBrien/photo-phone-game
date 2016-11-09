(function () {

    var CONNECT_ERROR_CODES = {
        GAME_IN_PROGRESS: 0,
        NAME_TAKEN: 1,
        INVALID_ROOM_CODE: 2,
        INVALID_USER_NAME: 3
    };

    //Change how the const is stored based on the target environment
    if (typeof angular !== typeof undefined) {
        angular.module('photoTelephoneApp')
            .constant('CONNECT_ERROR_CODES',
                CONNECT_ERROR_CODES);
    }
    else if (typeof module !== typeof undefined) {
        module.exports = CONNECT_ERROR_CODES;
    }

}());