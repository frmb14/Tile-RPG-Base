var _timer = new Date();

define(['Vector', 
		'Map',
		'Spell'], 
function(Vector, 
		Map, 
		Spell){
	/**
	 * A Player as an object.
	 */
	function Player(height, width, position, velocity, level, type, specific){
		this.height		= height    || 32;
		this.width		= width     || 32;
		this.position	= position  || new Vector();
		this.velocity	= velocity  || new Vector(1,1);
		this.level 	 	= level		|| 1; // Currently unused
		this.type	  	= type		|| 0; // 0 - neutral, 1 - friendly, 2 - Hostile
		this.specific 	= specific  || {}
		this.direction  = 			new Vector(0, 1);
		this.isHit		= 			false;
		this.isDead 	= 			false;
		this.swingTime	= 			1000;
		this.lastSwing 	= 			Date.now();
		this.spellCooldown = 		Date.now();
		
		/**
		 * NPC Specific properties
		 */
		this.moveUpdate = Date.now();
		this.movePos = 0;
		this.died = Date.now();
		this.respawn = 2*(60*1000);
	}

	Player.prototype = {
		
		draw: function(ct, player){
				if(this.isHit){
					if ((Date.now() / 150 | 0) % 2) {
						// Blink the character as an indication that it's been hit
						ct.drawImage(Game.gameTiles, player.x, player.y, 32, 32, this.position.x, this.position.y, this.width, this.height);
						for(index in player.additional){
							//Add additional tiles if set
							ct.drawImage(Game.gameTiles, player.additional[index].x, player.additional[index].y, 32, 32, this.position.x, this.position.y, this.width, this.height);
						}
					}
				}
				else{
					//Draw player
					ct.drawImage(Game.gameTiles, player.x, player.y, 32, 32, this.position.x, this.position.y, this.width, this.height);
					for(index in player.additional){
						//Add additional tiles if set
						ct.drawImage(Game.gameTiles, player.additional[index].x, player.additional[index].y, 32, 32, this.position.x, this.position.y, this.width, this.height);
					}
					
				}
				if(Object.keys(this.specific.health).length < 6){
					//We've taken damage, display our current health
					ct.drawImage(Game.gameTiles, this.specific.health[Object.keys(this.specific.health)[0]]*32, 0*32, 32, 32, this.position.x, this.position.y, this.width, this.height);
				}
				if(Object.keys(this.specific.health).length === 0){
					// The character have died. :c
					this.isDead = true;
					this.died = new Date();
				}
				//Draw player name if it exists and give it a nice transparent background
				if(player.name != undefined){
					ct.fillStyle = "rgba(0,0,0,0.8)";
					ct.font = "12px Arial"; 
					ct.fillRect(this.position.x-3, this.position.y-11, ct.measureText(player.name).width+6, parseInt(ct.font)+1);
					var color = "yellow"; switch(this.type){ case 1: color = "green"; break; case 2: color = "red"; break;}
					ct.fillStyle = color;
					ct.fillText(player.name, this.position.x, this.position.y);
				}
				
				// Do this NPC have any quests?
				
				var pos = this.position;
				var npcId = this.specific.id;
				
				if(player.quests != undefined){
					// Sort the quests array by Complete (true first, false last)
					player.quests.sort(player.quests.sortBy('complete', true));
					player.quests.forEach(function (entry, index) {

						if(entry.isAvailable() || entry.inQuestLog()){
							entry.updateCompleted();
							
							var completePriority = false;
							// Do we have a quest compeleted? Lets prioritize the completed one.
							if(player.quests[index-1] != undefined && !player.quests[index-1].isAvailable() && player.quests[index-1].isComplete() && player.id == player.quests[index-1].turnInId && !player.quests[index-1].turnedIn){
								completePriority = true;
							}
							
							// Set the quest indicator color
							var questColor = entry.inQuestLog() && !entry.isAvailable() && !entry.isComplete() ? "Lightgrey" : "Yellow";
							// Which symbol should we use?
							var questMark = entry.inQuestLog() && !entry.isAvailable() && player.id == entry.turnInId ? "?" : !entry.inQuestLog() && !completePriority ? "!" : "return";
							// Did it say "return"? Then there should not be anything written out here.
							if(questMark == "return") return;
							ct.font = "Bold 15px Arial"; 
							ct.fillStyle = questColor;
							ct.lineWidth = 1;
							ct.strokeStyle = 'black'; 
							ct.strokeText(questMark, pos.x+16, pos.y-13);
							ct.fillText(questMark, pos.x+16, pos.y-13);
						}
					});
				}
		},
		
		/**
		 * Movement functions, set the direction to the way we're going (for spells). 
		 * Check if we'll collide with any object, if so do not allow any movement, else move to the direction set.
		 */
		/*moveLeft: function(){ this.direction = new Vector(-1, 0); if(this.objectCollide(-1, 0)) return; this.position.x -= 1 * this.velocity.x; },
		moveRight: function(){ this.direction = new Vector(1, 0); if(this.objectCollide(1, 0)) return; this.position.x += 1 * this.velocity.x; },
		moveUp: function(){ this.direction = new Vector(0, -1); if(this.objectCollide(0, -1)) return; this.position.y -= 1 * this.velocity.y; },
		moveDown: function(){ this.direction = new Vector(0, 1); if(this.objectCollide(0, 1)) return; this.position.y += 1 * this.velocity.y; },*/
		moveLeft: function(){ this.direction = new Vector(-1, 0); this.position.x = this.objectCollide(0, this.position, new Vector(-1), (-1 * this.velocity.x)); },
		moveRight: function(){ this.direction = new Vector(1, 0); this.position.x = this.objectCollide(0, this.position, new Vector(-1), (1 * this.velocity.x)); },
		moveUp: function(){ this.direction = new Vector(0, -1);   this.position.y = this.objectCollide(1, this.position, new Vector(0,-1), (-1 * this.velocity.y)); },
		moveDown: function(){ this.direction = new Vector(0, 1);  this.position.y = this.objectCollide(1, this.position, new Vector(), (1 * this.velocity.y)); },

		playerUpdate: function(){
			
			// Diagonal movement is not allowed
			if(Key.isDown(Key.UP, Key.W)) 			this.moveUp();
			if(Key.isDown(Key.LEFT, Key.A) 
				&& !Key.isDown(Key.UP, Key.W) 
				&& !Key.isDown(Key.DOWN, Key.S)
			)   									this.moveLeft();
			if(Key.isDown(Key.DOWN, Key.S)) 		this.moveDown();
			if(Key.isDown(Key.RIGHT, Key.D) 
				&& !Key.isDown(Key.UP, Key.W) 
				&& !Key.isDown(Key.DOWN, Key.S)
			)  										this.moveRight();
			//Fire!!
			if(Key.isDown(Key.N1))					this.castSpell();
		},
		
		waypointUpdate: function(waypoint){
			
			// Move the NPC to it's waypoints
			if(waypoint.path[this.movePos] == 3) this.moveRight();
			if(waypoint.path[this.movePos] == 6) this.moveDown();
			if(waypoint.path[this.movePos] == 9) this.moveLeft();
			if(waypoint.path[this.movePos] == 12) this.moveUp();
			
			if(Date.now() - this.moveUpdate >= waypoint.duration[this.movePos]){
					this.moveUpdate = Date.now();
				if(this.movePos < waypoint.path.length-1)
					this.movePos++; //Increment the NPC waypoint array to next step
				else
					this.movePos = 0; // Restart from 0
			}
		},

		stayInArea: function(width, height) {
			// Keep the player inside the area
			if(this.position.y-this.height < -this.height)  this.position.y = 0;
			if(this.position.y+this.height > height)        this.position.y = height-this.height;
			if(this.position.x+this.width > width)         this.position.x = width-this.width;
			if(this.position.x-this.width < -this.width)   this.position.x = 0;
		},
		
		playerCollide: function(player){
			
			var collision = this.position.x >= player.position.x - player.width/2 && this.position.x <= player.position.x + player.width/2 && this.position.y >= player.position.y - player.height/2 && this.position.y <= player.position.y + player.height/2;
			if(collision) console.log("Player collision detected");
			// Have we collided with an enemy and their attack is not on cooldown? Take a hit!
			if(collision && this.type == 2 && Date.now() - this.lastSwing >= this.swingTime && !player.isHit && !player.isDead && !this.isDead){
				player.isHit = true;
				//Delete 1 health from the player
				delete player.specific.health["hit"+Object.keys(player.specific.health).length];
				// Set swing timer on cooldown
				this.lastSwing = Date.now();
				Game.bloodPos.push({x: player.position.x, y: player.position.y, mapOffset: new Vector(Game.offsetX, Game.offsetY), mapRegion: this.specific.mapRegion, tile: Frmb.random(3,7), duration: Frmb.random(2*1000,5*1000), hit: Date.now()});
			}
			return collision;
		},
		
		objectCollide: function(isY, position, direction, intent){
			
			// Are we going into a wall? I hope not! We're not allowed to go through walls here.
			// This needs a better algorithm.. 
			//var posY = (this.position.y+(y*this.height/2))/30 | 0;
			//return Map.collisionMap[posY > 14 ? 14+Game.offsetY : posY+Game.offsetY][((this.position.x+(x*this.width/2))/30 | 0)+Game.offsetX];
			
			// Correct the direction value when offsetX is bigger than 15, unknown bug.
			if(Game.offsetX > 15 && Math.sign(intent) == -1 ) direction.x = direction.x * 2;
			var newPosition = isY ? position.y : position.x,
				tryPosition = isY ? Math.floor((position.y+intent+32)/30)+Game.offsetY : Math.floor((position.x+intent+32)/30)+Game.offsetX;
			
			if(isY && !Map.collisionMap[tryPosition+direction.y][Math.floor((position.x/30)+Game.offsetX)+direction.x]){
				newPosition = position.y+intent;
			}
			else if(!isY && !Map.collisionMap[Math.floor((position.y/30)+Game.offsetY)+direction.y][tryPosition+direction.x]){
				newPosition = position.x+intent;
			}
			return newPosition;
		},
		
		castSpell: function(){
			// Are we allowed to cast a spell?
			if(Date.now() - this.spellCooldown >= 1000){
				x = this.position.x+16;
				y = this.position.y+10;
				// Create a new spell object and push it to our Spells array
				Game.spells.push(new Spell(16, 16, new Vector(x, y), new Vector(10,10), this.direction, 10, this.position));
				this.spellCooldown = Date.now();
			}
		},
		
		questUpdate: function(player){
			var questGiverMovement = true;
			// Are the player and the NPC close, then interaction range is true.
			var interactionRange = this.position.x >= player.position.x - player.width && this.position.x <= player.position.x + player.width && this.position.y >= player.position.y - player.height && this.position.y <= player.position.y + player.height;
			
			// Any quests on this NPC?
			if(this.specific.quests != undefined){
				var questsArr = this.specific.quests;
				var npcArr = this.specific;
				//Sort the quests by complete 
				questsArr.sort(questsArr.sortBy('complete', true));
				// Loop through all the quests
				questsArr.forEach(function (entry, index) {
					if(interactionRange){
						// Is the quest available?
						if(entry.isAvailable()){
							console.log(entry.title + " is available");	
							questGiverMovement = false;
							// Have we pressed enter?
							if(Key.isDown(Key.ENTER) && new Date() - _timer >= 500){
								// Only do this once / quest
								if(!Game.showQuest){
									Game.showQuest = true;
									_timer = new Date();
									// Add the quest temporarily 
									entry.addQueue();
									console.log("Show Quest Log");
								}
								else if(new Date() - _timer >= 500){
									// The quest have already been displayed for the player and the input ENTER was pressed again, that means they have accepted it!
									entry.accept(npcArr.id);
									Game.showQuest = false;
								}
							}
							else if(Key.isDown(Key.ESCAPE)){
								// The quest was declined, remove the temp quest added 
								Game.showQuest = false;
								Game.questLog.splice(Game.questLog.length-1, 1);
							}
						}
						else if(entry.isComplete() && entry.inQuestLog() && npcArr.id == entry.turnInId && new Date() - _timer >= 500){
							// The quest have been completed and this is the correct turn in NPC, don't move away little questgiver
							questGiverMovement = false;
							if(Key.isDown(Key.ENTER)){
								// Enter was presses, turn in the quest
								entry.turnIn();
								_timer = new Date();
								Game.showQuest = false;
							}
						}
					}
					if(!entry.isAvailable() && !entry.isComplete() && !entry.inQuestLog()){
						// Woah! The quest is not available, is not complete nor is in the questLog..?
						var prequestsComplete = false;
						
						// To activate this quest we need to loop through the prequests that's required
						for(index in entry.preQuest){
							// Is the preQuest ID (index) a valid number?
							if( !isNaN(parseFloat(index)) && isFinite(index)){
								// Find out if there is any quests with this ID
								preQuestId = questsArr.getIndexBy('id', entry.preQuest[index]);
								if(preQuestId != undefined && preQuestId != -1){
									// A quest is found, have we completed it?
									if(questsArr[preQuestId].isComplete() && !questsArr[preQuestId].inQuestLog()){
										// Yes! Then this quest have been completed
										prequestsComplete = true;
									}
									else{
										// Nop, not completed. Remember that the quest array have been sorted to Completed
										prequestsComplete = false;
									}
								}
							}
						}
						
						if(prequestsComplete){
							// was all quests returned completed? 
							entry.setAvailable();
							console.log("Pre-quests complete, set " + entry.title + " to available" );
						}
					}
				});
			}
			
			return questGiverMovement;
		}
	}

	return Player;

});