define(['Vector', 'Map', 'Loot'], function(Vector, Map, Loot){

	/**
	 * Spell as an object.
	 */
	function Spell(width, height, position, velocity, direction, range, castedPos){
		this.height = height || 2;
		this.width = width || 2;
		this.range = range*32 || 320;
		this.position = position || new Vector();
		this.velocity = velocity || new Vector();
		this.direction = direction || new Vector(0, 1);
		this.castedPos = castedPos || new Vector();
	}

	Spell.prototype = {
		draw: function(ct){
			//Draw the spell, in this case a fireball.
			ct.drawImage(Game.gameTiles, 3*32, 10*32, 32, 32, this.position.x, this.position.y, this.width, this.height);
		},

		moveForward: function(){
			// Move the spell according to the players direction
			this.position.x += this.direction.x * this.velocity.x;
			this.position.y += this.direction.y * this.velocity.y;
		},

		hitbox: function(){
			Game.spells.forEach(function (spell, spellIndex) {
				var spellX = spell.position.x;
				var spellY = spell.position.y;
				
				// Is the spell out of the set range? Delete it
				if(spell.direction.x == 1 || spell.direction.y == 1){
					if(spell.castedPos.x+spell.range <= spell.position.x || spell.castedPos.y+spell.range <= spell.position.y) Game.spells.splice(spellIndex, 1);
				}
				else{
					if(spell.castedPos.x-spell.range >= spell.position.x || spell.castedPos.y-spell.range >= spell.position.y) Game.spells.splice(spellIndex, 1);
				}
				
				Game.NPC.forEach(function (entry, npcIndex) {
					if(entry.specific.mapRegion.x.x <= Game.offsetX && entry.specific.mapRegion.x.y >= Game.offsetX && entry.specific.mapRegion.y.x <= Game.offsetY && entry.specific.mapRegion.y.y >= Game.offsetY){
						var npcX = entry.position.x;
						var npcY = entry.position.y;
						
						// Have we hit an object? Delete the spell
						if(!spell.objectCollide(spell.direction.y != 0 ? 1 : 0, spell.position, spell.direction))
							Game.spells.splice(spellIndex, 1);
						
						// Have we hit a NPC?
						if (spellX >= npcX - entry.width/2 && spellX <= npcX + entry.width && spellY >= npcY - entry.height/2 && spellY <= npcY + entry.height/2 && !entry.isHit && !entry.isDead){
							// Able to attack neutrals and hostile NPCs
							if(entry.type == 2 || entry.type == 0){
								// Add some blood to the hit position
								Game.bloodPos.push({x: entry.position.x, y: entry.position.y, mapOffset: new Vector(Game.offsetX, Game.offsetY), mapRegion: entry.specific.mapRegion, tile: Frmb.random(3,7), duration: Frmb.random(2*1000,5*1000), hit: Date.now()});
								entry.isHit = true;
								//Delete 1 health from the player
								delete entry.specific.health["hit"+Object.keys(entry.specific.health).length];
						
								if(Object.keys(entry.specific.health).length == 0){
									if(entry.specific.drop != undefined){
										Game.loot.push(new Loot(entry.specific.drop.velocity.x, entry.specific.drop.velocity.y, entry.position, entry.specific.drop.sprite, entry.specific.drop.name, new Vector(), entry.specific.mapRegion));
										console.log("Drop loot!");
									}
									//Delete the NPC from the array
									//Game.NPC.splice(npcIndex, 1);
									entry.isDead = true;
									entry.died = new Date();
									
									for(index in Game.questLog){
										// Loop though all accepted quests to see if we're killing any quest mobs
										if(Game.questLog[index].quest != undefined){
											if(Game.questLog[index].quest.killId.indexOf(entry.specific.id) >= 0){
												// The ID matches the ones in the quest, add progress!
												Game.questLog[index].quest.progress++;
												Game.showQuestProgress = {time: new Date(), progress: Game.questLog[index].quest.progress, required: Game.questLog[index].quest.required};
												if(Game.questLog[index].quest.progress >= Game.questLog[index].quest.required){
													// Enough kills have been met, set the quest to complete
													console.log("Quest compelete!");
													Game.questLog[index].quest.complete = true;
												}
											}
										}
									}
								}
								//Remove the NPC and spell
								Game.spells.splice(spellIndex, 1);
								console.log(entry.specific.name + " is hit!");
							}
						}
					}
				});
			});
		},
		
		/**
		 * Don't allow any spells to go though objects or walls.
		 */
		objectCollide: function(isY, position, direction){

			var newPosition = false,
				tryPosition = isY ? Math.floor((position.y+32)/30)+Game.offsetY : Math.floor((position.x+32)/30)+Game.offsetX,
				incrementX = direction.x == 1 ? -3 : 0,
				incrementY = direction.y == 1 ? -3 : 0;
				
				
			if(isY && !Map.collisionMap[tryPosition+direction.y+incrementY][Math.floor((position.x/30)+Game.offsetX)+direction.x]){
				newPosition = true;
			}
			else if(!isY && !Map.collisionMap[Math.floor((position.y/30)+Game.offsetY)+direction.y][tryPosition+direction.x+incrementX]){
				newPosition = true;
			}
			return newPosition;
		},
		
		/**
		 * Check if any spells have gone outside the game area, if so remove it from the spells array.
		 */
		outsideArea: function(width, height) {
			Game.spells.forEach(function (entry, index) {
				if(entry.position.y < 0) Game.spells.splice(index, 1);
				if(entry.position.y > height) Game.spells.splice(index, 1);
				if(entry.position.x > width) Game.spells.splice(index, 1);
				if(entry.position.x < 0) Game.spells.splice(index, 1);
			});
		},

		update: function (width, height){
			this.moveForward();
			this.outsideArea(width, height);
			this.hitbox();
		}
	}
	return Spell;
});