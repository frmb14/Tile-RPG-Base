require(['Vector',
		'Map',
		'Player',
		'Spell',
		'Loot'],
function(Vector,
		Map,
		Player,
		Spell,
		Loot){
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
		var width, height, canvas, ct, player, inGameMenu = false, offsetX = 0, offsetY = 0, lastArrPos = new Vector(), lastGameTick, gameTiles = new Image(), NPC = [], loot = [], spells = [], bloodPos = [];
		
		// MapSpecific variables
		var KingSpawned = false;
		var kingChestLooted = false;
		var npcWhenPlayerMove = [];
		// End of MapSpecific variables
		
		var init = function(canvas){
			
			canvas = document.getElementById(canvas);
			ct = canvas.getContext('2d');
			width = 960,
			height = 480,
			
			gameTiles,
			gameTiles.src = "tiles/DungeonCrawl_ProjectUtumnoTileset.png";
			
			// Create our player and give him some properties
			console.log("Creating the player object...");
			player = new Player(32, 32, new Vector(width/2, height/2), new Vector(2, 2), 1, 1,
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
			NPC.push(
				new Player(32, 32, new Vector(6*32, 9*32), new Vector(2, 2), 1, 1,
				{
					name: "Sorcerer",
					mapOffset: new Vector(),
					mapRegionX: new Vector(0,10),
					mapRegionY: new Vector(0,15),
					x: 24*32, y: 1*32,
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[6,0,9,0,3,0,12], duration:[300,3000,1500,3000,600,3000,3000]
					},
					additional: {}
				}),
				new Player(32, 32, new Vector(600, 200), new Vector(2, 2), 1, 0,
				{
					name: "Traveler",
					mapOffset: new Vector(),
					mapRegionX: new Vector(0,22),
					mapRegionY: new Vector(0,15),
					x: 4*32, y: 2*32,
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[0,12,0,6,0], duration:[1500,600,3000,600,3000]
					},
					additional: {},
					drop: { name: "gold", sprite: new Vector(59*32, 23*32), velocity: new Vector(32,32) }
				}),
				new Player(32, 32, new Vector(100, 425), new Vector(1, 1), 1, 2, {
					name: "Rat",
					mapOffset: new Vector(),
					mapRegionX: new Vector(0,10),
					mapRegionY: new Vector(0,15),
					x: 28*32, y: 4*32,
					health: {hit3: 0, hit2: 38, hit1: 35}, // This Rat NPC only have 3 health points
					waypoint: {
						path:[3,0,6,9,12,0,9,0], duration:[600,2000,200,300,200,1000,300,5000]
					},
					additional: {}
				}),
				new Player(32, 32, new Vector(50, 350), new Vector(1, 1), 1, 2, {
					name: "Rat",
					mapOffset: new Vector(),
					mapRegionX: new Vector(0,10),
					mapRegionY: new Vector(0,15),
					x: 28*32, y: 4*32,
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[12,9,6,3,0,3,6,9,12], duration:[500,500,500,500,3000,500,500,500,500]
					},
					additional: {}
				}),
				new Player(32, 32, new Vector(20, 300), new Vector(1, 1), 1, 2, {
					name: "Rat",
					mapOffset: new Vector(),
					mapRegionX: new Vector(0,10),
					mapRegionY: new Vector(0,15),
					x: 23*32, y: 4*32,
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[0,12,0,3,6,0,9], duration:[3000,600,3000,200,600,3000,200]
					},
					additional: {}
				})
			);
			
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
				if(!entry.isDead && entry.specific.mapRegionX.x <= Game.offsetX && entry.specific.mapRegionX.y >= Game.offsetX){
					entry.waypointUpdate(entry.specific.waypoint);
					entry.playerCollide(player);
				}
			});
			
			Game.spells.forEach(function(entry){ entry.update(width, height); });
			Game.loot.forEach(function(entry){ entry.playerPickup(player.position); });
		};

		var render = function(){
			ct.clearRect(0,0,width,height);
			
			var arrPos = Map.playerArrayPosition(player.position, 1, 1);
			//console.log(arrPos);
			if(arrPos.x >= 25 && arrPos.x != lastArrPos.x || arrPos.x == 24 && lastArrPos.x == 25){
				//console.log(lastArrPos.x); // Echo debug
				
				if(arrPos.x > lastArrPos.x) Game.offsetX += 1;
				else if(arrPos.x < lastArrPos.x) Game.offsetX -= 1;
				lastArrPos.x = arrPos.x;
				
				if(arrPos.x > 28){
					player.position.x = 32*11;
					lastArrPos.x = Map.playerArrayPosition(player.position, 1, 1);
					Game.offsetX += 15;
					Game.offsetX = Math.round(Game.offsetX/10)*10;
					console.log(Game.offsetX);
				}
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
			if(arrPos.y >= 12)
				Game.offsetY = (arrPos.y-15)+4;
			

			// Move the map accordingly to our position
			Map.render(ct, Game.offsetX, Game.offsetY);
			
			//If a player is hit, draw some blood on the ground
			bloodPos.forEach(function (entry, index) {
				
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
					console.log(entry.specific.mapRegionX.x +" "+ Game.offsetX + " : " + entry.specific.mapRegionX.y +" "+ Game.offsetX);
				if(entry.specific.mapRegionX.x <= Game.offsetX && entry.specific.mapRegionX.y >= Game.offsetX){
					//Move the NPC's if the map position changes
					if(entry.specific.mapOffset.x != Game.offsetX){
						if(entry.specific.mapOffset.x > Game.offsetX) entry.position.x += 32;
						else entry.position.x -= 32;
						entry.specific.mapOffset.x = Game.offsetX;
					}
					
					if(entry.specific.mapOffset.y != Game.offsetY){
						if(entry.specific.mapOffset.y > Game.offsetY) entry.position.y += 32;
						else entry.position.y -= 32;
						entry.specific.mapOffset.y = Game.offsetY;
					}
					
					
					entry.draw(ct, entry.specific);
				}
			});
			Game.spells.forEach(function(entry){ entry.draw(ct); });
			Game.loot.forEach(function(entry){
				entry.draw(ct); 
			});
			
		};

		var mapConditions = function(){
			//Include map specific conditions, objectives / quests,
			// this should be in it's own file if possible, future work.
			
			// If all rats have been killed, spawn the King Rat!
			if(Game.NPC.filter(function (_npc) { return _npc.specific.name == "Rat" }).length == 0 && !KingSpawned){
				console.log("Spawning the King Rat!");
				KingSpawned = true;
				NPC.push(
					new Player(64, 64, new Vector(20, 200), new Vector(3, 3), 1, 2, {
						name: "King Rat",
						x: 12*32, y: 1*32,
						health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
						waypoint: {
							path:[6,3,12,0,6,9,12,0], duration:[1200,1900,2000,3000,2000,1900,1200,10000]
						},
						additional: {},
						drop: { name: "King Rat's Precious Treasure!", sprite: new Vector(45*32, 45*32), velocity: new Vector(32,32) }
					})
				);
			}
			// King killed and chest looted? You Win!
			if(KingSpawned && !kingChestLooted && Game.NPC.filter(function (_npc) { return _npc.specific.name == "King Rat" }).length == 0 && Game.loot.filter(function (isDaLootGone) { return isDaLootGone.name == "King Rat's Precious Treasure!" }).length == 0){
				kingChestLooted = true;
				alert("Congratulations! You looted King Rat's Precious Treasure! and now you're rich! Thank you for playing, press 'R' to restart.")
			}
		}
		
		var gameLoop = function(){
			if(!Game.inGameMenu){
				var now = Date.now();
				//td = (now - (lastGameTick || now) / 1000);
				lastGameTick = now;
				requestAnimFrame(gameLoop);
				mapConditions();
				update();
				render();
			}
			else{
				canvas = document.getElementById('gameArea');
				ct = canvas.getContext('2d');
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
			'inGameMenu': inGameMenu
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
				Game.inGameMenu = !Game.inGameMenu;
				Game.gameLoop();
				break;
			default: break;
		};
	};
});