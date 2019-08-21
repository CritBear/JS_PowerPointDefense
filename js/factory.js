function getTowerById( id ) {

	if( id ) {
		for(var i = 0; i < objectList.tower.legnth; i++) {
			if(objectList.tower[i] && objectList.tower[i].id === id) {
				return objectList.tower[i];
			}
		}
	}
	return false;
}

function getEnemyById( id ) {

	if( id ) {
		for(var i = 0; i < objectList.enemy.legnth; i++) {
			if(objectList.enemy[i] && objectList.enemy[i].id === id) {
				return objectList.enemy[i];
			}
		}
	}
	return false;
}

function getBulletById( id ) {

	if( id ) {
		for(var i = 0; i < objectList.bullet.legnth; i++) {
			if(objectList.bullet[i] && objectList.bullet[i].id === id) {
				return objectList.bullet[i];
			}
		}
	}
	return false;
}

function makeTower( name ) {

	var options = {};

	gameManager.towerCount++;
	options.id = name + gameManager.towerCount;
	options.name = name;

	return {

		setPos: function( v ) {

			if(v instanceof Vector2) {
				options.pos = v;
				return this;
			}
		},
		build: function() {

			var tower;

			switch( name ) {
				case "basicTower":
					tower = new BasicTower(options);
					break;
				case "fastTower":
					tower = new FastcTower(options);
					break;
				case "iceTower":
					tower = new IceTower(options);
					break;
				case "spearTower":
					tower = new SpearTower(options);
					break;
				case "cannonTower":
					tower = new CannonTower(options);
					break;
				case "frozenTower":
					tower = new FrozenTower(options);
					break;
				case "iceBoltTower":
					tower = new IceBoltTower(options);
					break;
				case "icicleTower":
					tower = new IcicleTower(options);
					break;
				case "railGunTower":
					tower = new railGunTower(options);
					break;
				default:
					throw new Error("Wrong tower name!");
			}
			objectList.tower.push( tower );
			return;
		}
	}
}

function Road( pos, w, h ) {

	this.pos = pos;
	this.width = w;
	this.height = h;
}

function TurningPoint( pos, direction ) {

	this.pos = pos;
	this.direction = direction;
	this.radius = 40;
}

function makeEnemy( name ) {

	var options = {};
	var offset = new Vector2(Math.floor(Math.random()*map.start.width)-map.start.width/2,Math.floor(Math.random()*map.start.height)-map.start.height/2);

	gameManager.enemyCount++;
	options.id = name + gameManager.enemyCount;
	options.name = name;
	options.pos = new Vector2(map.start.pos.x, map.start.pos.y);
	options.pos.add(offset);
	options.offset = offset;

	return {

		setMaxHealth: function( value ) {

			options.maxHealth = value;
			return this;
		},
		setDirection: function( vector ) {

			options.direction = vector;
			return this;
		},
		setSpeed: function( value ) {

			options.speed = value;
			return this;
		},
		setReward: function( value ) {

			options.reward = value;
			return this;
		},
		build: function() {

			objectList.enemy.push( new BasicEnemy( options ) );
			return;
		}
	}
}

function makeBullet( name ) {

	var options = {};

	gameManager.bulletCount++;
	options.id = name + gameManager.bulletCount;
	options.name = name;

	return {

		setPos: function( vector ) {

			options.pos = vector;
			return this;
		},
		setTargetId: function( id ) {

			options.targetId = id;
			return this;
		},
		setDamage: function( value ) {

			options.damage = value;
			return this;
		},
		build: function() {

			var bullet;

			switch( name ) {
				case "basicBullet":
					bullet = new BasicBullet(options);
					break;
				case "fastBullet":
					bullet = new FastBullet(options);
					break;
				case "iceBullet":
					bullet = new IceBullet(options);
					break;
				case "spearBullet":
					bullet = new SpearBullet(options);
					break;
				case "icicleBullet":
					bullet = new IcicleBullet(options);
					break;
				case "cannonBullet":
					bullet = new CannonBullet(options);
					break;
				case "railGunBullet":
					bullet = new RailGunBullet(options);
					break;
				default:
					throw new Error("Wrong bullet name!");
			}
			objectList.bullet.push( bullet );
			return;
		}
	}
}

function makeEffect( name ) {

	var options = {};

	gameManager.effectCount++;
	options.id = name + gameManager.effectCount;
	options.name = name;

	return {

		setPos: function( vector ) {

			options.pos = vector;
			return this;
		},
		setSize: function( w, h ) {

			options.width = w;
			options.height = h;
			return this;
		},
		setDuration: function( value ) {

			options.duration = value;
			return this;
		},
		setAngle: function( alpha ) {

			options.angle = alpha;
			return this;
		},
		setSizeShift: function( direction ) {

			options.sizeShift = direction;
			return this;
		},
		setTransparentShift: function( direction ) {

			options.transparentShift = direction;
			return this;
		},
		build: function() {

			objectList.effect.push( new Effect( options ) );
			return;
		}
	}
}

var Effect = (function() {

	function Effect( options ) {

		this.name = options.name;
		this.pos = options.pos;
		this.width = options.width || effectInfo[options.name].width;
		this.cWidth = this.width;
		this.height = options.height || effectInfo[options.name].height;
		this.cHeight = this.height;
		this.duration = options.duration || effectInfo[options.name].duration;
		this.maxDuration = this.duration;
		this.image = effectInfo[options.name].image;
		this.transparency = 1;
		this.angle = options.angle || 0;
		this.sizeShift = options.sizeShift || 0;
		this.transparentShift = options.transparentShift || 0;
	}

	Effect.prototype.update = function() {

		if(this.transparentShift === -1) {
			this.transparency = this.duration / this.maxDuration;
		} else if(this.transparentShift === 1) {
			this.transparency = 1 - (this.duration / this.maxDuration);
		}

		if(this.sizeShift * this.transparentShift === 1) {
			this.cWidth = this.width * this.transparency;
			this.cHeight = this.height * this.transparency;
		} else if(this.sizeShift * this.transparentShift === -1) {
			this.cWidth = this.width * (1 - this.transparency);
			this.cHeight = this.height * (1 - this.transparency);
		}

		this.render();

		this.duration--;
		if(this.duration <= 0) {
			this.remove();
		}
	};
	Effect.prototype.remove = function() {

		for(var i = 0; i < objectList.effect.length; i++) {
			if(objectList.effect[i] === this) {
				objectList.effect[i] = null;
				return;
			}
		}
	};
	Effect.prototype.render = function() {

		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.angle);
		ctx.translate(-this.pos.x, -this,pos.y);

		ctx.globalAlpha = this.transparency;
		ctx.drawImage(this.image, this.pos.x - this.cWidth/2, this.pos.y - this.cHeight/2, this.cWidth, this.cHeight);
		ctx.globalAlpha = 1;

		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(-this.angle);
		ctx.translate(-this.pos.x, -this,pos.y);
	};

	return Effect;
})();