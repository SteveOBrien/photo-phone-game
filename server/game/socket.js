(function () {

    const PHASES = require('../../shared/phases');
    const CONNECT_ERROR_CODES = require('../../shared/errors-connection');
    const POSSIBLE_ROOM_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ROOM_CODE_LENGTH = 4;

    var controllerFactory = require('./controller');

    module.exports.init = init;

    function init(httpServer) {
        var io = require('socket.io')(httpServer).of('/game');
        var rooms = {};
        io.use(function (socket, next) {

            var user = socket.handshake.query.user;
            //Ensure that the username is actually valid (no blanks)
            if (user === undefined || (user = user.trim()).length === 0) {
                next(new Error(CONNECT_ERROR_CODES.INVALID_USER_NAME))
                return;
            }

            var roomCode = socket.handshake.query.room;
            var room;
            if (roomCode !== undefined) { //Trying to join a room. Perform some room validation before joining
                room = rooms[roomCode.toUpperCase()];

                //Check the user is trying to join a room the exists
                if (room === undefined) {
                    next(new Error(CONNECT_ERROR_CODES.INVALID_ROOM_CODE));
                    return;
                }

                //Don't allow two users with the same name to connect
                //TODO allow reconnects
                var playerIndex = room.getPlayerList().indexOf(user);
                if (playerIndex != -1 && room.getPlayerList()[playerIndex].connected) {
                    next(new Error(CONNECT_ERROR_CODES.NAME_TAKEN));
                    return;
                }

                //Prevent the user from joining a game in progess
                //TODO allow reconnects
                if (room.getPhase() != PHASES.WAITING) {
                    next(new Error(CONNECT_ERROR_CODES.GAME_IN_PROGRESS));
                    return;
                }
            }
            else {
                roomCode = generateRandomString(POSSIBLE_ROOM_CODE_CHARS, ROOM_CODE_LENGTH);
                room = rooms[roomCode] = new controllerFactory.TelephoneServerController(io.to(roomCode));
            }
            initPlayerSocket(socket, room, roomCode, user);
            next();
        });

        io.on('connection', function (socket) {

            socket.room.sendPlayerListUpdate();

            socket.on('disconnect', function () {
                //Remove user from the list depending on game state
                if (socket.room !== undefined) {
                    socket.room.leave(socket.nickname);
                }
            });

            socket.on('start', function () {
                socket.room.start();
            });

            socket.on('guess', function (data) {
                socket.room.submitGuess(socket.nickname, data.text);
            });

            socket.on('drawing', function (data) {
                socket.room.submitDrawing(socket.nickname, data.drawing);
            });

        });

        /**
         * Inits the player socket by setting up all data on the socket object and joining the room
         * @param socket The socket to init
         * @param room The room the player will join
         */
        function initPlayerSocket(socket, room, roomCode, username) {
            //Set the nickname and join the room
            socket.nickname = username;
            socket.room = room;
            socket.join(roomCode);
            room.join(socket.nickname, socket);
            socket.emit('playerSettings', {'user': socket.nickname, 'room': roomCode});
        }
    }

    /**
     * Generates a string of random characters
     * @param {string} possibleCharacters A string of characters to use to generate the random code
     * @param {number} length The length of the random code
     * @returns {string} The randomly generated code
     */
    function generateRandomString(possibleCharacters, length) {
        var code = "";
        for (var i = 0; i < length; i++) {
            code += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        }
        return code;
    }

}());