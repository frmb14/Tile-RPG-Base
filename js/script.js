require(['ArrayUtilities',
		'Vector',
		'Map',
		'Player',
		'Spell',
		'Loot',
		'Npcs',
		'Quests'],
function(ArrayUtilities,
		Vector,
		Map,
		Player,
		Spell,
		Loot,
		Npcs,
		Quests){
		'use strict';
		
	var FPS = 30;

	/** 
	 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 */
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){
					window.setTimeout(callback, 1000 / FPS);
				};
	})();

	/**
	 * Shim layer, polyfill, for cancelAnimationFrame with setTimeout fallback.
	 */
	window.cancelRequestAnimFrame = (function(){
		return  window.cancelRequestAnimationFrame || 
				window.webkitCancelRequestAnimationFrame || 
				window.mozCancelRequestAnimationFrame    || 
				window.oCancelRequestAnimationFrame      || 
				window.msCancelRequestAnimationFrame     || 
				window.clearTimeout;
	})();

	/**
	 * Key listeners
	 */
	window.Key = {
		pressed:{},

		LEFT:	37,
		UP:		38,
		RIGHT:	39,
		DOWN:	40,
		SPACE:	32,
		ESCAPE: 27,
		ENTER: 	13,
		A:		65,
		S:		83,
		D:		68,
		W:		87,
		N1: 	49,
		N2:		50,
		N3: 	51,

		isDown: function(keyCode, keyCode1){
			return this.pressed[keyCode] || this.pressed[keyCode1];
		},

		onKeydown: function(event){
			this.pressed[event.keyCode] = true;
			//console.log(event.keyCode);
		},

		onKeyup: function(event) {
			delete this.pressed[event.keyCode];
		}
	};

	window.addEventListener('keyup',   function(event) { Key.onKeyup(event); },   false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

	window.Game = (function(){
		var width, height, canvas, ct, player, inGameMenu = false, offsetX = 0, offsetY = 0, lastArrPos = new Vector(), lastGameTick, gameTiles = new Image(), NPC = [], loot = [], spells = [], bloodPos = [], quests = [], questLog = [], showQuest = false, showQuestProgress = {};
		
		var init = function(canvas){
			
			/**
			 * Function for getting the index of an array by name and value
			 */ 
			
			ArrayUtilities.init();
			
			canvas = document.getElementById(canvas);
			ct = canvas.getContext('2d');
			width = 960,
			height = 480,
			
			gameTiles,
			gameTiles.src = "tiles/DungeonCrawl_ProjectUtumnoTileset.png";
			
			// Create our player and give him some properties
			console.log("Creating the player object...");			     //2, 2
			player = new Player(32, 32, new Vector(6*32, 4*32), new Vector(2, 2), 1, 1,
			{
				name: 'Player',
				x: 4*32, y: 31*32,
				health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35}, // The player have 6 health points
				additional: { 1: {x: 4*32, y: 6*32}, 2: {x: 12*32, y: 36*32} } // A little gear for our character is nice to have!
			});
			// Set the current array position for the player
			lastArrPos = Map.playerArrayPosition(player.position, 1, 1);
			/**
			 * Create NPCs and add their properties and movement
			 */
			Npcs.spawn();
			
			console.log('Init the game');
		};
		
		var update = function(){
			
			// Are we dead? No? Allow us to move!
			if(!player.isDead){
				player.playerUpdate();
				player.stayInArea(width, height);
			}
			
			//Run though all NPC's, possible spells and loot drops
			Game.NPC.forEach(function(entry){
				if(!entry.isDead && entry.specific.mapRegion != undefined && entry.specific.mapRegion.x.x <= Game.offsetX && entry.specific.mapRegion.x.y >= Game.offsetX && entry.specific.mapRegion.y.x <= Game.offsetY && entry.specific.mapRegion.y.y >= Game.offsetY){
					
					entry.playerCollide(player);
					
					if(entry.questUpdate(player))
						entry.waypointUpdate(entry.specific.waypoint);
					
				}
			});
			
			Game.spells.forEach(function(entry){ entry.update(width, height); });
			Game.loot.forEach(function(entry){ entry.playerPickup(player.position); });
		};

		var render = function(){
			ct.clearRect(0,0,width,height);
			
			// Our position
			var arrPos = Map.playerArrayPosition(player.position, 1, 1);

			if(arrPos.x >= 25 && arrPos.x != lastArrPos.x || arrPos.x == 24 && lastArrPos.x == 25){
				
				if(arrPos.x > lastArrPos.x) Game.offsetX += 1;
				else if(arrPos.x < lastArrPos.x && Game.offsetX > 0) Game.offsetX -= 1;
				lastArrPos.x = arrPos.x;
				
				if(arrPos.x > 28){
					player.position.x = 32*11;
					lastArrPos.x = Map.playerArrayPosition(player.position, 1, 1);
					Game.offsetX += 15;
					Game.offsetX = Math.round(Game.offsetX/10)*10;
				}
				console.log(Game.offsetX);
			}
			else if(arrPos.x <= 6 && Game.offsetX > 0 && arrPos.x != lastArrPos.x){
				if(arrPos.x > lastArrPos.x) Game.offsetX += 1;
				else if(arrPos.x < lastArrPos.x) Game.offsetX -= 1;
				lastArrPos.x = arrPos.x;
				if(arrPos.x <= 3){
					player.position.x = 32*20;
					lastArrPos.x = Map.playerArrayPosition(player.position, 1, 1);
					Game.offsetX -= 15;
					Game.offsetX = Math.round(Game.offsetX/10)*10;
					console.log(Game.offsetX);
				}
			}
			
			//Going down
			if(arrPos.y >= 13 && arrPos.y != lastArrPos.y || arrPos.y == 12 && lastArrPos.y == 13){
				
				if(arrPos.y > lastArrPos.y) Game.offsetY += 1;
				else if(arrPos.y < lastArrPos.y && Game.offsetY > 0) Game.offsetY -= 1;
				lastArrPos.y = arrPos.y;
				
				if(arrPos.y > 14){
					player.position.y = 32*6;
					lastArrPos.y = Map.playerArrayPosition(player.position, 1, 1);
					Game.offsetY += 10;
					Game.offsetY = Math.round(Game.offsetY/10)*10;
					console.log(Game.offsetY);
				}
			}
			// Going up
			else if(arrPos.y <= 4 && Game.offsetY > 0 && arrPos.y != lastArrPos.x){
				if(arrPos.y > lastArrPos.y) Game.offsetY += 1;
				else if(arrPos.y < lastArrPos.y) Game.offsetY -= 1;
				lastArrPos.y = arrPos.y;
				if(arrPos.y <= 1){
					player.position.y = 32*10;
					lastArrPos.y = Map.playerArrayPosition(player.position, 1, 1);
					Game.offsetY -= 10;
					Game.offsetY = Math.round(Game.offsetY/10)*10;
					console.log(Game.offsetY);
				}
			}
			

			// Move the map accordingly to our position
			Map.render(ct, Game.offsetX, Game.offsetY);
			
			//If a player is hit, draw some blood on the ground
			bloodPos.forEach(function (entry, index) {
				
				if(entry.mapRegion.x.x <= Game.offsetX && entry.mapRegion.x.y >= Game.offsetX && entry.mapRegion.y.x <= Game.offsetY && entry.mapRegion.y.y >= Game.offsetY){
					//Move the NPC's if the map position changes
					if(entry.mapOffset.x != Game.offsetX){
						if(entry.mapOffset.x > Game.offsetX) entry.x += 32;
						else entry.x -= 32;
						entry.mapOffset.x = Game.offsetX;
					}
					
					if(entry.mapOffset.y != Game.offsetY){
						if(entry.mapOffset.y > Game.offsetY) entry.y += 32;
						else entry.y -= 32;
						entry.mapOffset.y = Game.offsetY;
					}
					
					ct.drawImage(gameTiles, entry.tile*32, 0*32, 32, 32,entry.x, entry.y, 32, 32);
				}
				
				if(Date.now() - entry.hit >= entry.duration) bloodPos.splice(index, 1);
				// Remove isHit if more than 1500 milliseconds have pasted since last hit or if bloodPos array is empty for both the player and the NPC
				var damageClear = bloodPos.length == 0 || Date.now() - bloodPos[bloodPos.length-1].hit >= 1500;
				NPC.forEach(function(entry){
					if(entry.isHit && damageClear) entry.isHit = false;
				});
				if(damageClear) player.isHit = false;
			});
			
			// Render the player as long as it's not dead
			if(!player.isDead){
				player.draw(ct, player.specific);
			}
			else{
				// The player have died, draw a "gravestone" and display message 
				ct.drawImage(gameTiles, 53*32, 44*32, 32, 32, player.position.x, player.position.y, player.width, player.height);
				ct.font = "40px Arial"; ct.strokeStyle = 'black'; ct.lineWidth = 3;
				ct.strokeText("You are dead...",width/3,height/3); ct.fillText("You are dead...",width/3,height/3);
				ct.font = "20px Arial"; ct.strokeStyle = 'black'; ct.lineWidth = 2;
				ct.strokeText("Press 'R' to restart",(width/3)+45,(height/3)+25); ct.fillText("Press 'R' to restart",(width/3)+45,(height/3)+25);
				
			}

			// Render all available NPC's, spells and loot drops
			Game.NPC.forEach(function(entry){
				if(!entry.isDead && entry.specific.mapRegion.x.x <= Game.offsetX && entry.specific.mapRegion.x.y >= Game.offsetX && entry.specific.mapRegion.y.x <= Game.offsetY && entry.specific.mapRegion.y.y >= Game.offsetY){
					
					//Move the NPC's if the map position changes
					if(entry.specific.mapOffset.x != Game.offsetX){

						var newPos = entry.specific.posBeforeOffset.x-(Game.offsetX*32);
						entry.position.x = newPos;
						
						entry.specific.mapOffset.x = Game.offsetX;
					}
					
					if(entry.specific.mapOffset.y != Game.offsetY){
						
						var newPos = entry.specific.posBeforeOffset.y-(Game.offsetY*32);
						entry.position.y = newPos;
						
						entry.specific.mapOffset.y = Game.offsetY;
					}
					
					entry.draw(ct, entry.specific);
				}
				if(entry.isDead && entry.specific.mapRegion.x.x <= Game.offsetX && entry.specific.mapRegion.x.y >= Game.offsetX && entry.specific.mapRegion.y.x <= Game.offsetY && entry.specific.mapRegion.y.y >= Game.offsetY){
					if(new Date() - entry.died >= entry.respawn){
						entry.specific.health = entry.specific.fullHealth;
						entry.isDead = false;
					}
				}
			});
			Game.spells.forEach(function(entry){ entry.draw(ct); });
			Game.loot.forEach(function(entry){ entry.draw(ct); });
			
			if(Game.showQuest){
				var quest = Game.questLog[Game.questLog.length-1].quest;
				
				ct.fillStyle = "rgba(0,0,0,0.8)";
				ct.font = "20px Arial"; 
				ct.fillRect(0, 0, 960, 480);
				ct.fillStyle = "Yellow";
				ct.textAlign="center";
				ct.fillText(quest.title, 480, 100);
				ct.font = "15px Arial"; 
				ct.fillText(quest.context, 480, 125);
				ct.fillText(quest.objective, 480, 150);
				ct.fillText("Press [ENTER] to Accept this quest or [ESC] to decline or cancel", 480, 250);
				ct.textAlign="left";
			}
			
			if(Game.showQuestProgress && new Date() - Game.showQuestProgress.time <= 3000){
				
				var text = "Progress "+Game.showQuestProgress.progress+" / "+Game.showQuestProgress.required;
				
				if(Game.showQuestProgress.progress == Game.showQuestProgress.required) text += " - Quest complete!";
					
				
				ct.fillStyle = 'yellow';
				ct.font = "16px Arial"; ct.strokeStyle = 'black'; ct.lineWidth = 2;
				ct.strokeText(text ,400,50); ct.fillText(text,400,50);
				console.log("Quest mob killed");
			}
			
		};
		
		var gameLoop = function(){
			if(!Game.inGameMenu){
				var now = Date.now();
				//td = (now - (lastGameTick || now) / 1000);
				lastGameTick = now;
				requestAnimFrame(gameLoop);
				update();
				render();
			}
			else{
				canvas = document.getElementById('gameArea');
				ct = canvas.getContext('2d');
				ct.fillStyle = "rgba(0,0,0,0.4)";
				ct.fillRect(0, 0, 960, 480);
				ct.fillStyle = 'yellow';
				ct.font = "40px Arial"; ct.strokeStyle = 'black'; ct.lineWidth = 2;
				ct.strokeText("Paused",400,150); ct.fillText("Paused",400,150);
			}
		};
		
		// Return public available methods and properties
		return {
			'init'		: init,
			'gameLoop'	: gameLoop,
			'spells'	: spells,
			'bloodPos'	: bloodPos,
			'NPC'		: NPC,
			'gameTiles' : gameTiles,
			'loot'		: loot,
			'offsetX'	: offsetX,
			'offsetY'	: offsetY,
			'inGameMenu': inGameMenu,
			'quests'	: quests,
			'questLog'	: questLog,
			'showQuest' : showQuest,
			'showQuestProgress' : showQuestProgress
		}
	})();

	/**
	 * Run the game
	 */
	$(function(){
		Game.init('gameArea');
		Game.gameLoop();
		console.log('Ready to play.');
	});

	//Allow the game to be restarted even after dead of the character
	document.onkeydown = function(e){
		var key = (e.keyCode ? e.keyCode : e.which);
		switch(key){
			case 'r':
			case 82:
				if (confirm('Are you sure you want to restart the game?')){
					location.reload();
				}
				break; 
			case 27:
				if(!Game.showQuest){
					Game.inGameMenu = !Game.inGameMenu;
					Game.gameLoop();
				}
				break;
			default: break;
		};
	};
});