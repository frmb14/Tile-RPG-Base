define(['Vector'], function(Vector){

	/**
	 * Loot as an object.
	 */
	function Loot(width, height, position, sprite, name, mapOffset, mapRegion){
		this.height = height || 2;
		this.width = width || 2;
		this.position = position || new Vector();
		this.sprite = sprite || new Vector();
		this.name = name || undefined;
		this.mapOffset = mapOffset || new Vector();
		this.mapRegion = mapRegion || new Vector(new Vector(0,20),new Vector(0,15));
	}

	Loot.prototype = {
		draw: function(ct){
			if(this.mapRegion.x.x <= Game.offsetX && this.mapRegion.x.y >= Game.offsetX && this.mapRegion.y.x <= Game.offsetY && this.mapRegion.y.y >= Game.offsetY){
				if(this.mapOffset.x != Game.offsetX){
					if(this.mapOffset.x > Game.offsetX) this.position.x += 32;
					else this.position.x -= 32;
					this.mapOffset.x = Game.offsetX;
				}
				
				if(this.mapOffset.y != Game.offsetY){
					if(this.mapOffset.y > Game.offsetY) this.position.y += 32;
					else this.position.y -= 32;
					this.mapOffset.y = Game.offsetY;
				}
				
				ct.drawImage(Game.gameTiles, this.sprite.x, this.sprite.y, 32, 32, this.position.x, this.position.y, this.width, this.height);
			}
		},
		
		/**
		 * Run a check on all dropped loots to see if the player is close enough to pick it up
		 */
		playerPickup: function(position){
			Game.loot.forEach(function (entry, index) {
				if(entry.mapRegion.x.x <= Game.offsetX && entry.mapRegion.x.y >= Game.offsetX && entry.mapRegion.y.x <= Game.offsetY && entry.mapRegion.y.y >= Game.offsetY){
					var lootX = entry.position.x;
					var lootY = entry.position.y;
					if (position.x >= lootX - entry.width && position.x <= lootX + entry.width && position.y >= lootY - entry.height && position.y <= lootY){
						console.log("Picking up " + entry.name);
						Game.loot.splice(index, 1);
					}
				}
			});
		}
	}

	return Loot;

});