var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	path = require('path');
  
/*************************************************************************************
						FILE SERVER
*************************************************************************************/

server.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../') + req.url);
});

/*************************************************************************************
						SOCKET.IO
*************************************************************************************/

var rooms = {};

var game = io
	.of('/game')
	.on( 'connection', function ( socket ) 
{
	socket.on('disconnect', function () {
		//Remove user from the list depending on game state
		rooms[socket.room].leave(socket.nickname);
		sendPlayerListUpdate();
	});
	
	socket.on( 'join', function (data) {
		if(rooms[data.room] !== undefined){
			rooms[data.room].join(data.user);
		}
		else{
			rooms[data.room] = new TelephoneServerController(data.user, io.of('/game').to(socket.room));
		}
		
		//Set the nickname and join the room
		socket.nickname = data.user;
		socket.room = data.room;
		socket.join(data.room);
		
		//Send the updated user list
		sendPlayerListUpdate();
		
	});
	
	socket.on( 'start', function(data){
		rooms[socket.room].start();
	});
	
	function sendPlayerListUpdate(){
		io.of('/game').to(socket.room).emit('updatedUserList', rooms[socket.room].getPlayerList());
	}
	
});

function TelephoneServerController(user, socket){

	var socket = socket;
	var players = {};
	players[user] = {};
	var Phases = {
			WAITING : 0,
			START : 1,
			DRAWING : 2,
			GUESSING : 3,
			END : 4
		};
	var phase = Phases.WAITING;
	var playOrder = [];
	
	return{
		getPlayerList : getPlayerList,
		join : join,
		leave : leave,
		start : start
	};
	
	function updateState(newState){
		phase = newState;
		socket.emit('stateUpdate', phase);
	}
	
	function start(){
		//Update the game state and send update to clients
		updateState(Phases.START);
		
		//Calculate the play order
		calculatePlayOrder();
	}
	
	function calculatePlayOrder(){
		playOrder = [];
		var scratchPad = [];
		for(var i = 0; i < getPlayerCount(); i++){
			scratchPad.push(i);
		}
		
		for (var user in players) {
			if (players.hasOwnProperty(user)) {
				var index = getRandomInt(0, scratchPad.length);
				playOrder[ scratchPad[index] ] = user; //Add the order value
				scratchPad.splice(index, 1); //remove the item from the working array
				console.log(index);
			}
		}
		
		console.log("Starting game");
		console.log(playOrder.length);
		for(i = 0; i < playOrder.length; i++){
			console.log( "%s --> ", playOrder[i] );
		}
		console.log(playOrder[0]);
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
	
	function submitDrawing(){
		//Handle the submission of a drawing
	}
	
	function submitText(){
		//Handle the submission of text
	}
	
	function getPlayerList(){
		var playerNames = [];
		for(var name in players){
			if(players[name] !== null){
				playerNames.push(name);
			}
		}
		return playerNames;
	}
	
	function join(user){
		console.log(user + ' joining...');
		players[user] = {};
	}
	
	function leave(user){
		players[user] = null;
	}

}