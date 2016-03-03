(function(){
	'use strict';
	angular.module('photoTelephoneApp').factory('gameService', GameService);
	
	GameService.$inject = ['$timeout'];
	function GameService($timeout){
		
		var playerSettings = undefined;
		var players = [];
		var currentPlayerIdx = -1;
		var socket = undefined;
		var Phases = {
			WAITING : 0,
			START : 1,
			DRAWING : 2,
			GUESSING : 3,
			END : 4
		};
		var phase = Phases.WAITING;
		var service = {
			players: players,
			login: login,
			isConnected: isConnected,
			phase : phase,
			Phases : Phases,
			startGame : startGame
		};
		activate();
		return service;
		
		
		
		function activate(){
			
		}
		
		function startGame(){
			socket.emit('start');
		}
		
		function connect(){
			if(socket === undefined){
				socket = io('//localhost:8000/game');
				socket.on('updatedUserList', function(data) {
					//players = data;
					$timeout(function(){
						while(players.length > 0){
							players.pop();
						}
						for(var item in data){
							players.push(data[item]);
						}
					}, 0);
				});
				
				socket.on('stateUpdate', function(data){
					phase = data;
					console.log("Phase updated to %s", data);
				});
			}
			else{
				console.warn('A connection to the server already exists.');
			}
		}
		
		function isConnected(){
			return !(socket === undefined);
		}
		
		function login(user, room){
			playerSettings = new PlayerSettings(user, room);
			connect();
			socket.emit('join', {
				'user' : user,
				'room' : room 
			});
		}
	}
	
	function PlayerSettings(username, room){
		this.username = username;
		this.room = room;
	}
	
})();