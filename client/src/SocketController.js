import io from 'socket.io-client';
import PHASES from './shared/Phases';

class PlayerSettings {
    constructor(username, room){
        this.username = username;
        this.room = room;
    }
}

let socket = undefined;

class SocketController{

    constructor(phaseUpdateCallback, drawingUpdateCallback, guessUpdateCallback, playerSettingsCallback, playerListCallback, resultsCallback){
        this.playerSettings = {};
        this.players = [];
        this.currentDrawing = null;
        this.currentGuess = null;
        this.results = null;
        this.phase = null;
        this.connected = false;

        this.phaseUpdateCallback = phaseUpdateCallback;
        this.drawingUpdateCallback = drawingUpdateCallback;
        this.guessUpdateCallback = guessUpdateCallback;
        this.playerSettingsCallback = playerSettingsCallback;
        this.playerListCallback = playerListCallback;
        this.resultsCallback = resultsCallback;
    }


    startGame() {
        socket.emit('start');
    }

    submitDrawing(dataUrl) {
        socket.emit('drawing', {'drawing': dataUrl});
    }

    submitText(text) {
        socket.emit('guess', {'text': text});
    }

    connect(user, room) {
        if (socket === undefined) {
            var url = '//' + window.location.hostname + ':3001/game?user=' + user;
            if (room !== undefined) {
                url += '&room=' + room;
            }
            socket = io(url, {'forceNew': true});
            socket.on('connect', () => {
                this.phaseUpdateCallback(PHASES.WAITING);
                socket.on('updatedUserList', (data) => {
                    this.playerListCallback(data);
                });

                socket.on('stateUpdate', (data) => {
                    console.log('state updated', data);
                    this.phaseUpdateCallback(data);
                });

                socket.on('nextImage', (data) => {
                    this.drawingUpdateCallback(data);
                });

                socket.on('nextGuess', (data) => {
                    this.guessUpdateCallback(data);
                });

                socket.on('results', (data) => {
                    console.log('results', data);
                    this.resultsCallback(data);
                });

                socket.on('playerSettings', (data) => {
                    console.log('set playeers');
                    this.playerSettingsCallback(new PlayerSettings(data.user, data.room));
                });
            });

            //The server will send various errors. Store these errors so the consuming components can be made aware
            socket.on('error', function (data) {
                //TODO store errors in location so they can be read by the GUI
                console.error('connection error - ' + data);
            });
            
            this.connected = true;

        }
        else {
            console.warn('A connection to the server already exists.');
        }
    }

    isConnected() {
        return !(socket === undefined);
    }

}

export default SocketController;