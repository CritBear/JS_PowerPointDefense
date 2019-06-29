var canvas;
var ctx;

var objectList = {
	tower: [],
	enemy: [],
	bullet: [],
	UI: [],
	effect: [],
};

var images = {};

var gameManager = {
	
	images: {
		money: new Image(),
		life: new Image(),
		nextRound: new Image(),
	},
	
	money: undefined,
	life: undefined,
	round: undefined,
	score: undefined,
	towerCount: undefined,
	enemyCount: undefined,
	bulletCount: undefined,
	effectCount: undefined,
	spawnQueue: undefined,
	frameCount: undefined,
	
	initialize: function() {
		
		this.images.money.src = "images/UI_money.png";
		this.images.life.src = "images/UI_life.png";
		this.images.nextRound.src = "images/nextRound.png";
		
		towerInfo.loadImage();
		effectInfo.loadImage();
		
		this.money = 4000;
		this.life = 20;
		this.round = 0;
		this.score = 0;
		this.towerCount = 0;
		this.enemyCount = 0;
		this.bulletCount = 0;
		this.effectCount = 0;
		this.spawnQueue = [];
		this.frameCount = 0;
		
		this.isEnd = false;
	},
	
	nextRound: function() {
		
		this.round++;
		
		var round = roundInfo[ this.round - 1 ];
		for( var i = 0; i < round.num; i++ ) {
			var spawnInfo = {
				name: round.name,
				health: round.health,
				speed: round.speed,
				rate: round.rate,
				reward: round.reward
			};
			this.spawnQueue.push( spawnInfo );
		}
	},
	
	update: function() {
		
		if( this.spawnQueue.length > 0 ) {
			this.frameCount++;
			if( this.spawnQueue[0].rate < this.frameCount ) {
				var spawn = this.spawnQueue.shift();
				this.frameCount = 0;
				
				makeEnemy( "basicEnemy" ).setMaxHealth( spawn.health ).setSpeed( spawn.speed ).setReward( spawn.reward ).build();
			}
		}
		
		if( this.isEnd ) {
			ctx.globalAlpha = 0.7;
			ctx.fillStyle = "black";
			ctx.fillRect( 0, 0, canvas.width, canvas.height );
			ctx.globalAlpha = 1;
			ctx.fillStyle = "white";
			ctx.font = "50px Arial";
			ctx.fillText( "GAME OVER!", canvas.width/2 - 130, canvas.height/2 - 50 );
			ctx.font = "40px Consolas";
			ctx.fillText( "ROUND " + this.round, canvas.width/2 - 50, canvas.height/2 + 50 );
			ctx.font = "20px Consolas";
			ctx.fillText( "Restart by 'F5'", canvas.width/2 - 50, canvas.height/2 + 100 );
		} else {
			requestAnimationFrame( update );
		}
	},
	
	addLife: function( value ) {
		
		this.life += value;
		if( this.life <= 0 ) {
			this.isEnd = true;
		}
	},
};

var mouse = {
	
	pos: new Vector2(),
	isLocating: false,
	locatingTower: {},
	locatable: true,
	
	setLocatingTower: function( name ) {
		
		this.isLocating = true;
		this.locatingTower.name = name;
		this.locatingTower.range = towerInfo[ name ].range;
		this.locatingTower.radius = towerInfo[ name ].radius;
		this.locatingTower.cost = towerInfo[ name ].cost;
		this.locatingTower.image = towerInfo[ name ].image;
	},
	
	click: function() {
		
		if( this.isLocating && this.locatable ) {
			makeTower( this.locatingTower.name ).setPos( new Vector2( this.pos.x, this.pos.y ) ).build();
			gameManager.money -= this.locatingTower.cost;
			this.isLocating = false;
		}
	},
	
	update: function() {
		
		this.locatable = true;
		
		if( this.isLocating ) {
			if( this.pos.x - this.locatingTower.radius < 0 || this.pos.x + this.locatingTower.radius > 1060 || this.pos.y - this.locatingTower.radius < 0 || this.pos.y + this.locatingTower.radius > 700 ) {
				this.locatable = false;
			} else {
				for( var i = 0; i < map.road.length; i++ ) {
					if( collisionArcRect( {pos: this.pos, radius: this.locatingTower.radius}, map.road[i] ) ) {
						this.locatable = false;
						break;
					}
				}
				if( this.locatable ) {
					for( var i = 0; i < objectList.tower.length; i++ ) {
						if( collisionArcArc( {pos: this.pos, radius: this.locatingTower.radius}, objectList.tower[i] ) ) {
							this.locatable = false;
							break;
						}
					}
				}
			}
		}
		
		this.render();
	},
	
	render: function() {
		
		if( this.isLocating ) {
			if( !this.locatable ) {
				ctx.save();
				ctx.globalAlpha = 0.7;
				ctx.beginPath();
				ctx.arc( this.pos.x, this.pos.y this.locatingTower.radius, 0, Math.PI*2 );
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.restore();
			}
			
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.arc( this.pos.x, this.pos.y, this.locatingTower.range, 0, Math.PI*2 );
			ctx.fillStyle = "#333";
			ctx.fill();
			ctx.globalAlpha = 1;
			
			ctx.drawImage(
				this.locatingTower.image,
				this.pos.x - this.locatingTower.radius,
				this.pos.y - this.locatingTower.radius,
				this.locatingTower.radius * 2,
				this.locatingTower.radius * 2
			);
		} else {
			ctx.save();
			ctx.beginPath();
			ctx.arc( this.pos.x, this.pos.y, 10, 0, Math.PI*2, false );
			ctx.fillStyle = "yellow";
			ctx.fill();
			ctx.restore();
		}
	},
};

var map = {
	
	start: {
		pos: new Vector2( 100, 50 ),
		width: 40,
		height: 20,
	},
	end: {
		pos: new Vector2( 1000, 650 ),
		width: 40,
		height: 20,
	},
	road: [
		new Road( new Vector2( 75, 0 ), 50, 300 ),
		new Road( new Vector2( 75, 300 ), 300, 50 ),
		new Road( new Vector2( 375, 300 ), 50, 200 ),
		new Road( new Vector2( 175, 500 ), 250, 50 ),
		new Road( new Vector2( 175, 550 ), 50, 100 ),
		new Road( new Vector2( 175, 650 ), 500, 500 ),
		new Road( new Vector2( 675, 150 ), 50, 550 ),
		new Road( new Vector2( 725, 150 ), 250, 50 ),
		new Road( new Vector2( 975, 150 ), 50, 550 ),
	],
	turningPoint: [
		new TurningPoint( new Vector2( 75, 350 ), new Vector2( 1, 0 ) ),
		new TurningPoint( new Vector2( 425, 300 ), new Vector2( 0, 1 ) ),
		new TurningPoint( new Vector2( 425, 550 ), new Vector2( -1, 0 ) ),
		new TurningPoint( new Vector2( 175, 500 ), new Vector2( 0, 1 ) ),
		new TurningPoint( new Vector2( 175, 700 ), new Vector2( 1, 0 ) ),
		new TurningPoint( new Vector2( 725, 700 ), new Vector2( 0, -1 ) ),
		new TurningPoint( new Vector2( 675, 150 ), new Vector2( 1, 0 ) ),
		new TurningPoint( new Vector2( 1025, 150 ), new Vector2( 0, 1 ) ),
	],
	
	update: function() {
		
		this.render();
	},
	
	render: function() {
		
		ctx.save();
		
		ctx.fillStyle = "#aaa";
		for( var i = 0; i < this.road.length; i++ ) {
			var road = this.road[i];
			ctx.fillRect( road.pos.x, road.pos.y, road.width, road.height );
		}
		
		ctx.fillStyle = "green";
		ctx.fillRect( this.start.pos.x - this.start.width/2, this.start.pos.y - this.start.height/2, this.start.width, this.start.height );
		
		ctx.fillStyle = "red";
		ctx.fillRect( this.end.pos.x - this.end.width/2, this.end.pos.y - this.end.height/2, this.end.width, this.end.height );
		
		ctx.restore();
	},
};