define(function(){

	/**
	 * Quests as an object.
	 */
	function Quests(id, title, context, objective, type, required, killId, available, preQuest, turnInId, complete){
		this.id = id || 1;
		this.title = title || undefined;
		this.context = context || undefined;
		this.objective = objective || undefined;
		this.type = type || 1; // 1: Kill, 2: Gather, 3: Go to Another NPC
		this.required = required || 1;
		this.killId = killId || [];
		this.available = available || false;
		this.preQuest = preQuest || [];
		this.turnInId = turnInId || 0;
		this.complete = complete || false;
		this.progress = 0;
		this.turnedIn = false;
		
		
		Game.quests.push(
			// Add the quest to the global quests array
			{id: this.id, quest: this}
		);
	}

	Quests.prototype = {
		
		addQueue: function(){
			Game.questLog.push(
				// Add the quest to the global questLog array
				{id: this.id, quest: this}
			);
		},
		
		accept: function(giverId){
			
			if(giverId != this.turnInId){
				// The quest is supposed to be turned in at another quest giver
				console.log("Move the quest to NPC " + this.turnInId);
				var quest = this;
				// Find the quest giver and transfer the quest to them
				Game.NPC.forEach(function(entry){
					if(entry.specific.id == quest.turnInId){
						entry.specific.quests.push(quest);
						console.log("Adding quest to " + entry.specific.name);
					}
				});
			}
			
			// Remove from from available quests
			this.available = false;
			console.log(Game.questLog);
			console.log("Accepting quest " + this.id + " " + this.title);
		},
		
		turnIn: function(){
			
			// Set this quest to turned in
			this.turnedIn = true;
			
			console.log("Turn in Quest " +this.title);
			
			// Get this id in the questLog array with the ArrayUtilities and remove it from the quest log. (Quest rewards?)
			var index = Game.questLog.getIndexBy("id", this.id);
			Game.questLog.splice(index, 1);
			
			
		},
		
		addProgress: function(){
			// increment the progress
			this.progress++;
		},
		
		updateCompleted: function(){
			// Find this quest ID in the questlog array
			var index = Game.questLog.getIndexBy("id", this.id);
			if(index != undefined){
				// ID found, set this quest to complete
				if(Game.questLog[index].quest.complete || Game.questLog[index].quest.type == 3){
					this.complete = true;
				}
			}
		},
		
		isAvailable: function(){
			return this.available;
		},
		
		setAvailable: function(){
			this.available = true;
		},
		
		isComplete: function(){
			return this.complete;
		},
		
		inQuestLog: function(){
			// Find the quest in the questLog array, return true if found or false if not found
			var index = Game.questLog.getIndexBy("id", this.id);
			if(index != undefined){
				return true;
			}
			else{
				return false;
			}
		}
	}

	return Quests;

});