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
			//{id: this.id, quest: {title: this.title, context: this.context, objective: this.objective, type: this.type, required: this.required, killId: this.killId, available: this.available, complete: this.complete, preQuest: this.preQuest}}
			{id: this.id, quest: this}
		);
	}

	Quests.prototype = {
		
		addQueue: function(){
			Game.questLog.push(
				//{id: this.id, quest: {title: this.title, context: this.context, objective: this.objective, type: this.type, required: this.required, killId: this.killId, progress: this.progress, complete: this.complete, preQuest: this.preQuest}}
				{id: this.id, quest: this}
			);
		},
		
		accept: function(giverId){

			if(giverId != this.turnInId){
				console.log("Move the quest to NPC " + this.turnInId);
				var quest = this;
				Game.NPC.forEach(function(entry){
					if(entry.specific.id == quest.turnInId){
						entry.specific.quests.push(quest);
						console.log("Adding quest to " + entry.specific.name);
					}
				});
			}
			
			this.available = false;
			console.log(Game.questLog);
			console.log("Accepting quest " + this.id + " " + this.title);
		},
		
		turnIn: function(){
			
			this.turnedIn = true;
			
			console.log("Turn in Quest " +this.title);
			
			var index = Game.questLog.getIndexBy("id", this.id);
			Game.questLog.splice(index, 1);
			
			
		},
		
		addProgress: function(){
			this.progress++;
		},
		
		updateCompleted: function(){
			var index = Game.questLog.getIndexBy("id", this.id);
			if(index != undefined){
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