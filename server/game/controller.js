import PHASES from '../../client/src/shared/Phases';
(function(){

    module.exports.TelephoneServerController = TelephoneServerController;

    /**
     * Data class used to keep track of player information
     * @param socket The players socket that will be used for communications
     * @constructor
     */
    //TODO move into own module
    function Player(socket){
        this.entryData = [];//The player 'owns' the drawing and guessing data for the item they have entered
        this.connected = true;//Flag to indicate if the user is still currently connected
        this.socket = socket;//The players socket so we can target communications with them
        this.targetPlayer = null;//The player this player should be guessing or drawing for. We keep track of this to know which entryData to load our submission into
        this.reconnect = function reconnect(socket) {
            this.socket = socket;
            this.connected = true;
        };
    }

    /**
     * Data class used to keep track of round entries
     * @param user The name of the user who submitted the entry
     * @param data The data for the entry
     * @constructor
     */
    //TODO move into own module
    function Entry(user, data) {
        this.user = user;
        this.data = data;
    }

    function TelephoneServerController(socket){

        var socket = socket;
        var players = {};
        var turnCount = 0;
        var phase = PHASES.WAITING;

        //The pass order for the application
        var passOrder = [];

        return{
            getPhase: getPhase,
            getPlayerList : getPlayerList,
            join : join,
            leave : leave,
            start : start,
            submitGuess : submitData,
            submitDrawing : submitData,
            sendPlayerListUpdate : sendPlayerListUpdate
        };

        function getPhase() {
            return phase;
        }

        function updateState(newState){
            phase = newState;
            socket.emit('stateUpdate', phase);
        }

        function start(){
            //Update the game state and send update to clients
            console.log('PHASES', PHASES.START);
            updateState(PHASES.START);

            //Calculate the play order
            calculatePlayOrder();
        }

        function calculatePlayOrder(){
            passOrder = [];
            var scratchPad = [];
            for(var i = 0; i < getPlayerCount(); i++){
                scratchPad.push(i);
            }

            for (var user in players) {
                if (players.hasOwnProperty(user)) {
                    var index = getRandomInt(0, scratchPad.length);
                    passOrder[ scratchPad[index] ] = user; //Add the order value
                    scratchPad.splice(index, 1); //remove the item from the working array
                }
            }

        }

        // Returns a random integer between min (included) and max (excluded)
        // Using Math.round() will give you a non-uniform distribution!
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function getPlayerCount(){
            var count = 0;
            for (var user in players) {
                if (players.hasOwnProperty(user)) {
                    ++count;
                }
            }
            return count;
        }

        function submitData(user, data){
            var entries = (players[user].targetPlayer || players[user]).entryData;
            if(entries.length > turnCount){
                console.log('already submitted guess!');
            }
            else{
                entries.push(new Entry(user, data));
            }
            if(isAllSubmissionsEntered()){
                transitionPhase();
            }
        }

        function getResultsData(){
            var results = {};
            for (var user in players) {
                if (players.hasOwnProperty(user)) {
                    results[user] = players[user].entryData;
                }
            }
            return results;
        }

        function transitionPhase(){
            ++turnCount;
            if(turnCount === passOrder.length){
                socket.emit('results', getResultsData());
                updateState(PHASES.END);

            }
            else{
                sendTurnData();
                updateState(
                    (phase === PHASES.GUESSING || phase === PHASES.START) ? PHASES.DRAWING : PHASES.GUESSING
                );
            }
        }

        /**
         * Sends the data for the next turn to each player.
         */
        function sendTurnData(){
            let emitKey = (phase === PHASES.GUESSING || phase === PHASES.START) ? 'nextGuess' : 'nextImage';
            for(let name in players){
                let player = players[name];
                let playerIdx = passOrder.indexOf(name);
                let targetIdx = (playerIdx + turnCount) % passOrder.length;
                let targetPlayer = players[passOrder[targetIdx]];
                let data = player.entryData[player.entryData.length - 1].data;
                targetPlayer.socket.emit(emitKey, data);
                targetPlayer.targetPlayer = player;
            }
        }

        function isAllSubmissionsEntered(){
            for(var name in players){
                if(players[name].connected && players[name].entryData.length <= turnCount){
                    return false;
                }
            }
            return true;
        }

        function getPlayerList(){
            return Object.keys(players);
        }

        /**
         *
         * @param {string} user The user's ID that is attempting to join
         * @param {object} playerSocket The user's socket that is attempting to join
         * @returns {boolean} Indicates if the player successfully joined or not
         */
        function join(user, playerSocket){
            if(players[user] === undefined){
                players[user] = new Player(playerSocket);
            }
            else if(!players[user].connected){
                players[user].reconnect(playerSocket);
            }
            else{
                return false;
            }
            sendPlayerListUpdate();
            return true;
        }

        function sendPlayerListUpdate(){
            socket.emit('updatedUserList', getPlayerList());
        }

        function leave(user){
            //If we're in the waiting room or have ended, remove the user completely from the list
            if (phase === PHASES.WAITING || phase === PHASES.END) {
                delete players[user];
            }
            else{
                //Otherwise, we'll flag as a disconnect so they may reconnect in the future (connection issues, closed app by mistake, etc...)
                //TODO add game logic to handle this situation
                players[user].connected = false;
                if (isAllSubmissionsEntered()) {
                    transitionPhase();
                }
            }
            sendPlayerListUpdate();
        }
    }
}());