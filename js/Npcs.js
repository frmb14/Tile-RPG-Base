define(['Vector','Player', 'Quests'], function(Vector, Player, Quests){
	
	return {
		
		spawn: function(){
			
			Game.NPC.push(
				new Player(32, 32, new Vector(9*32, 5*32), new Vector(2, 2), 1, 1,
				{
					id: 1,
					name: "Titus",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector(9*32, 5*32),
					x: 18*32, y: 2*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
					quests: [
						new Quests(1, "Welcome hero!", "Welcome hero! My name is Titus, I am a wizard! I have summoned you here from another realm only because we require your aid!", "But first you must pass this test to prove your worth! Slay 3 Crocs on the sandbank above us", 1, 3, [4,5], true, [], 1),
						new Quests(2, "You have proven yourself", "Very good, hero! You have proven yourself worthy. Time for your first important task", "Seek out the Oug Shaman east from here", 3, 1, [], false, [1], 7)
					]
				}),
				
				new Player(32, 32, new Vector((10*32)+5, 5*32), new Vector(2, 2), 1, 1,
				{
					id: 2,
					name: "Tinitus",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector((10*32)+5, 5*32),
					x: 6*32, y: 4*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(3*32, 11*32), new Vector(0.5, 0.5), 1, 1,
				{
					id: 3,
					name: "Bengt",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector(3*32, 11*32),
					x: 39*32, y: 4*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[0,9,0,3], duration:[5000,500,5000,500]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(14*32, 2*32), new Vector(1, 1), 1, 2,
				{
					id: 4,
					name: "Croc",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector(14*32, 2*32),
					x: 15*32, y: 3*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(20*32, 1*32), new Vector(1, 1), 1, 2,
				{
					id: 4,
					name: "Croc",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,20),new Vector(0,15)),
					posBeforeOffset: new Vector(20*32, 1*32),
					x: 15*32, y: 3*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(17*32, 2*32), new Vector(1, 1), 1, 2,
				{
					id: 5,
					name: "Moder Croc",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector(17*32, 2*32),
					x: 14*32, y: 3*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(25*32, 9*32), new Vector(2, 2), 1, 0,
				{
					id: 6,
					name: "Wasp",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,20),new Vector(0,15)),
					posBeforeOffset: new Vector(25*32, 9*32),
					x: 9*32, y: 4*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(18*32, 5*32), new Vector(2, 2), 1, 1,
				{
					id: 7,
					name: "Oug Shaman",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(1,40),new Vector(0,15)),
					posBeforeOffset: new Vector(37*32, 5*32),
					x: 0*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
					quests: [
						new Quests(3, "Ouga hello, we be needing help", "Ouga we needing you help hero! Snakes have been attacking our village, we help need to kill them", "Kill the 4 snakes southeast from here", 1, 4, [9,10,11], false, [2], 7),
						new Quests(4, "We greatful!", "Thank you for killing those snakes, they no longer torment ogua village", "Follow the path far northeast from here then speak to King Rauff", 3, 1, [], false, [2, 3], 13)
					]
				}),
				
				new Player(32, 32, new Vector(20*32, 4*32), new Vector(2, 2), 1, 1,
				{
					id: 8,
					name: "Oug Warrior",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(1,40),new Vector(0,15)),
					posBeforeOffset: new Vector(39*32, 4*32),
					x: 15*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(21*32, 6*32), new Vector(2, 2), 1, 1,
				{
					id: 8,
					name: "Oug Warrior",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(1,40),new Vector(0,15)),
					posBeforeOffset: new Vector(42*32, 6*32),
					x: 15*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(9*32, 9*32), new Vector(2, 2), 1, 2,
				{
					id: 9,
					name: "Blue Snake",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,40),new Vector(9,30)),
					posBeforeOffset: new Vector(27*32, 19*32),
					x: 34*32, y: 4*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(6*32, 11*32), new Vector(2, 2), 1, 2,
				{
					id: 9,
					name: "Blue Snake",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,40),new Vector(9,30)),
					posBeforeOffset: new Vector(25*32, 21*32),
					x: 34*32, y: 4*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(6*32, 6*32), new Vector(2, 2), 1, 2,
				{
					id: 10,
					name: "Red Snake",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,40),new Vector(9,30)),
					posBeforeOffset: new Vector(25*32, 16*32),
					x: 20*32, y: 4*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(4*32, 7*32), new Vector(2, 2), 2, 2,
				{
					id: 11,
					name: "Tiger Snake",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,40),new Vector(9,30)),
					posBeforeOffset: new Vector(23*32, 17*32),
					x: 17*32, y: 3*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(21*32, 7*32), new Vector(2, 2), 1, 0,
				{
					id: 12,
					name: "Butterfly",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,40),new Vector(9,30)),
					posBeforeOffset: new Vector(40*32, 17*32),
					x: 22*32, y: 4*32,
					fullHealth: {hit3: 0, hit2: 38, hit1: 35},
					health: {hit3: 0, hit2: 38, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(14*32, 2*32), new Vector(2, 2), 5, 1,
				{
					id: 13,
					name: "King Rauff",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(74*32, 2*32),
					x: 4*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
					quests: [
						new Quests(5, "Thanks for playing", "The demo for this game is now sadly over", "The end", 3, 1, [], false, [2, 3, 4], 13)
					]
				}),
				
				new Player(32, 32, new Vector(9*32, 6*32), new Vector(2, 2), 3, 1,
				{
					id: 14,
					name: "Guard",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(69*32, 6*32),
					x: 36*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(13*32, 5*32), new Vector(2, 2), 3, 1,
				{
					id: 14,
					name: "Guard",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(73*32, 5*32),
					x: 36*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(13*32, 10*32), new Vector(2, 2), 3, 1,
				{
					id: 14,
					name: "Guard",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(73*32, 10*32),
					x: 36*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				}),
				
				new Player(32, 32, new Vector(16*32, 5*32), new Vector(2, 2), 3, 1,
				{
					id: 14,
					name: "Guard",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(76*32, 5*32),
					x: 36*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				})
				,
				
				new Player(32, 32, new Vector(16*32, 10*32), new Vector(2, 2), 3, 1,
				{
					id: 14,
					name: "Guard",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(40,70),new Vector(0,15)),
					posBeforeOffset: new Vector(76*32, 10*32),
					x: 36*32, y: 9*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[], duration:[]
					},
					additional: {},
				})
			
				/*new Player(32, 32, new Vector(6*32, 9*32), new Vector(2, 2), 1, 1,
				{
					id: 1,
					name: "Sorcerer",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,10),new Vector(0,15)),
					posBeforeOffset: new Vector(6*32, 9*32),
					x: 24*32, y: 1*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[6,0,9,0,3,0,12], duration:[300,3000,1500,3000,600,3000,3000]
					},
					additional: {},
					quests: [new Quests(1, "Test Quest", "This is a test quest", "Do nothing", 3, 1, [], true, [], 2)]
				}),
				new Player(32, 32, new Vector(608, 200), new Vector(2, 2), 1, 0,
				{
					id: 2,
					name: "Traveler",
					mapOffset: new Vector(),
					mapRegion: new Vector(new Vector(0,19),new Vector(0,5)),
					posBeforeOffset: new Vector(608, 200),
					x: 4*32, y: 2*32,
					fullHealth: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					health: {hit6: 0, hit5: 37, hit4: 38, hit3: 36, hit2: 39, hit1: 35},
					waypoint: {
						path:[0,12,0,6,0], duration:[1500,600,3000,600,3000]
					},
					additional: {},
					drop: { name: "gold", sprite: new Vector(59*32, 23*32), velocity: new Vector(32,32) },
					quests: [ 
								new Quests(2, "Be gone pest!", "The rats are completely taking over! Please help us remove them!", "Kill the 3 rats west from here", 1, 1, [3,4], true, [], 2), 
								new Quests(3, "Find the Sorcerer", "Find da sorcerer, quickly! We require his aid!", "Sorcerer located", 3, 1, [], false, [2], 1),
								new Quests(4, "Find the Sorcerer Again! =O", "Find da sorcerer, quickly AGAIN! We require his aid!", "Sorcerer located", 3, 1, [], false, [2,3], 1) 
							]
				})*/
			);
		}
	};

});