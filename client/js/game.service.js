(function(){
	'use strict';
	angular.module('photoTelephoneApp').factory('gameService', GameService);

	GameService.$inject = ['$timeout', 'PHASES'];
	function GameService($timeout, PHASES) {
		
		var playerSettings = undefined;
		var players = [];
		var socket = undefined;
		var currentDrawing = null;
		var currentGuess = null;
		var results = null;
		var phase = PHASES.WAITING;
		var service = {
			players: players,
			connect: connect,
			getPlayerSettings : getPlayerSettings,
			isConnected: isConnected,
			getCurrentPhase : getCurrentPhase,
			Phases: PHASES,
			startGame : startGame,
			submitText : submitText,
			submitDrawing : submitDrawing,
			getCurrentDrawing : getCurrentDrawing,
			getCurrentGuess : getCurrentGuess,
			getResults : getResults
		};
		return service;

		function getPlayerSettings(){
			return playerSettings;
		}

		function getResults(){
			return results;
		}

		function getCurrentGuess(){
			return currentGuess;
		}

		function getCurrentDrawing(){
			return currentDrawing;
		}

		function getCurrentPhase(){
			return phase;
		}

		function startGame(){
			socket.emit('start');
		}

		function submitDrawing(dataUrl){
			socket.emit('drawing', {'drawing' : dataUrl});
		}

		function submitText(text){
			socket.emit('guess', {'text' : text});
		}
		
		function connect(user, room){
			if(socket === undefined){
				var url = '//' + window.location.hostname + (window.location.port === '' ? '' : ':' + window.location.port) + '/game?user=' + user;
				if(room !== undefined){
					url += '&room=' + room;
				}
				var tempSocket = io(url, {'forceNew': true});

				tempSocket.on('connect', function () {
					tempSocket.on('updatedUserList', function (data) {
						$timeout(function () {
							while (players.length > 0) {
								players.pop();
							}
							for (var item in data) {
								players.push(data[item]);
							}
						}, 0);
					});

					tempSocket.on('stateUpdate', function (data) {
						$timeout(function () {
							phase = data;
						}, 0);
					});

					tempSocket.on('nextImage', function (data) {
						$timeout(function () {
							currentDrawing = data;
						}, 0);
					});

					tempSocket.on('nextGuess', function (data) {
						$timeout(function () {
							currentGuess = data;
						}, 0);
					});

					tempSocket.on('results', function (data) {
						$timeout(function () {
							results = data;
						}, 0);
					});

					tempSocket.on('playerSettings', function (data) {
						$timeout(function () {
							playerSettings = new PlayerSettings(data.user, data.room);
						}, 0);
					});
					socket = tempSocket;
				});

				//The server will send various errors. Store these errors so the consuming components can be made aware
				tempSocket.on('error', function (data) {
					//TODO store errors in location so they can be read by the GUI
					alert('connection error - ' + data);
				});

			}
			else{
				console.warn('A connection to the server already exists.');
			}
		}
		
		function isConnected(){
			return !(socket === undefined);
		}

	}
	
	function PlayerSettings(username, room){
		this.username = username;
		this.room = room;
	}
	
})();