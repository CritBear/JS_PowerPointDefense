
function Bullet( options ) {
	
	this.id = options.id;
	this.pos = options.pos;
	this.vel = new Vector2();
	this.damage = options.damage;
	this.targetId = options.targetId;
	this.aim = getEnemyById( options.targetId ).pos;
	this.width = towerInfo[options.name].width;
	this.height = towerInfo[options.name].height;
	this.radius = towerInfo[options.name].radius;
	this.image = towerInfo[options.name].image;
	this.speed = towerInfo[options.name].speed;
	this.angle = Math.atan2(this.aim.y - this.pos.y, this.aim.x - this.pos.x);
}

Bullet.prototype.update = function() {
	
	this.move();
	this.hitCheck();
	this.render();
};
Bullet.prototype.move = function() {
	
	if(getEnemyById(this.targetId)) {
		this.aim = getEnemyById(this.targetId).pos;
		this.angle = Math.atan2(this.aim.y - this.pos.y, this.aim.x - this.pos.x);
	}
	
	if(this.pos.distance(this.aim) <= this.speed) {
		this.remove();
	}
	
	var vector = new Vector2(1, 0);
	this.pos = this.pos.add(vector.rotate(this.angle).scale(this.speed));
	if(this.pos.x < -100 || this.pos.y < -100 || this.pos.x > 1360 || this.pos.y > 800 ) {
		this.remove();
	}
};
Bullet.prototype.hitCheck = function() {
	
};
Bullet.prototype.remove = function() {
	
	for(var i = 0; i < objectList.bullet.length; i++) {
		if(objectList.bullet[i] === this) {
			objectList.bullet[i] = null;
		}
	}
};
Bullet.prototype.render = function() {
	
	ctx.translate(this.pos.x, this.pos.y);
	ctx.rotate(this.angle);
	ctx.translate(-this.pos.x, -this.pos.y);
	ctx.drawImage(this.image, this.pos.x - this.width/2, this.pos.y - this.height/2, this.width, this.height);
	ctx.translate(this.pos.x, this.pos.y);
	ctx.rotate(-this.angle);
	ctx.translate(-this.pos.x, -this.pos.y);
};

var BasicBullet = (function() {
	
	function BasicBullet( options ) {
		
		Bullet.call(this, options);
	}
	BasicBullet.prototype = Object.create(Bullet.prototype);
	BasicBullet.prototype.constructor = BasicBullet;
	
	BasicBullet.prototype.hitCheck = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				enemy.damaged(this.damage);
				
				makeEffect("hit_01").setSizeShift(-1).setTransparentShift(-1).setPos(this.pos).setAngle(Math.random()*Math.PI*2).build();
				this.remove();
			}
		}
	};
	
	return BasicBullet;
})();

var IceBullet = (function() {
	
	function IceBullet( options ) {
		
		Bullet.call(this, options);
	}
	IceBullet.prototype = Object.create(Bullet.prototype);
	IceBullet.prototype.constructor = IceBullet;
	
	IceBullet.prototype.hitCheck = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				enemy.damaged(this.damage);
				enemy.setDebuff("slow", 30);
				
				makeEffect("explosion_01").setDuration(10).setSize(50, 50).setTransparentShift(-1).setPos(this.pos).build();
				this.remove();
			}
		}
	};
	
	return IceBullet;
})();

var SpearBullet = (function() {
	
	function SpearBullet( options ) {
		
		Bullet.call(this, options);
		this.isHit = false;
		this.duration = 200;
	}
	SpearBullet.prototype = Object.create(Bullet.prototype);
	SpearBullet.prototype.constructor = SpearBullet;
	
	SpearBullet.prototype.update = function() {
		
		if(this.isHit) {
			this.duration--;
			if(this.duration < 0) {
				this.remove();
			}
		} else {
			this.move();
		}
		this.hitCheck();
		this.render();
	};
	SpearBullet.prototype.move = function() {
		
		if(getEnemyById(this.targetId)) {
			this.aim = getEnemyById(this.targetId).pos;
			this.angle = Math.atan2(this.aim.y - this.pos.y, this.aim.x - this.pos.x);
		}
		
		if(this.pos.distance(this.aim) <= this.speed) {
			this.ifHit = true;
		}
		
		var vector = new Vector2(1, 0);
		this.pos = this.pos.add(vector.rotate(this.angle).scale(this.speed));
		if(this.pos.x < -100 || this.pos.y < -100 || this.pos.x > 1360 || this.pos.y > 800 ) {
			this.remove();
		}
	};
	SpearBullet.prototype.hitCheck = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				enemy.damaged(this.damage);
				if(!this.isHit) {
					this.isHit = true;
				}
			}
		}
	};
	
	return SpearBullet;
})();

var IcicleBullet = (function() {
	
	function IcicleBullet( options ) {
		
		Bullet.call(this, options);
		this.isHit = false;
		this.duration = 50;
	}
	IcicleBullet.prototype = Object.create(Bullet.prototype);
	IcicleBullet.prototype.constructor = IcicleBullet;
	
	IcicleBullet.prototype.update = function() {
		
		if(this.isHit) {
			this.duration--;
			if(this.duration < 0) {
				for(var i = 0; i < objectList.enemy.length; i++) {
					if(!objectList.enemy[i]) {
						continue;
					}
					var enemy = objectList.enemy[i];
					if(this.pos.distance(enemy.pos) <= enemy.radius + 200) {
						enemy.damaged(this.damage * 10);
						enemy.setDebuff("frozen", 15);
					}
				}
				
				makeEffect("hit_02").setDuration(10).setSizeShift(1).setTransparentShift(-1).setSize(400, 400).setPos(this.pos).setAngle(Math.random()*Math.PI*2).build();
				this.remove();
			}
		} else {
			this.move();
		}
		this.hitCheck();
		this.render();
	};
	IcicleBullet.prototype.move = function() {
		
		if(getEnemyById(this.targetId)) {
			this.aim = getEnemyById(this.targetId).pos;
			this.angle = Math.atan2(this.aim.y - this.pos.y, this.aim.x - this.pos.x);
		}
		
		if(this.pos.distance(this.aim) <= this.speed) {
			this.ifHit = true;
		}
		
		var vector = new Vector2(1, 0);
		this.pos = this.pos.add(vector.rotate(this.angle).scale(this.speed));
		if(this.pos.x < -100 || this.pos.y < -100 || this.pos.x > 1360 || this.pos.y > 800 ) {
			this.remove();
		}
	};
	IcicleBullet.prototype.hitCheck = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				enemy.damaged(this.damage);
				enemy.setDebuff("slow", 5);
				if(!this.isHit) {
					this.isHit = true;
				}
			}
		}
	};
	
	return IcicleBullet;
})();

var CannonBullet = (function() {
	
	function CannonBullet( options ) {
		
		Bullet.call(this, options);
		this.range = towerInfo[options.name].range;
	}
	CannonBullet.prototype = Object.create(Bullet.prototype);
	CannonBullet.prototype.constructor = CannonBullet;
	
	CannonBullet.prototype.hitCheck = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				for(var j = 0; j < objectList.enemy.length; j++) {
					if(!objectList.enemy[j]) {
						continue;
					}
					if(this.pos.distance(objectList.enemy[j].pos) <= this.range) {
						objectList.enemy[j].damaged(this.damage);
					}
				}
				
				makeEffect("explosion_02").setTransparentShift(-1).setPos(this.pos).setSize(this.range*2, this.range*2).build();
				this.remove();
				break;
			}
		}
	};
	
	return CannonBullet;
})();

var RailGunBullet = (function() {
	
	function RailGunBullet( options ) {
		
		Bullet.call(this, options);
		this.range = towerInfo[options.name].range;
	}
	RailGunBullet.prototype = Object.create(Bullet.prototype);
	RailGunBullet.prototype.constructor = RailGunBullet;
	
	RailGunBullet.prototype.move = function() {
		
		var vector = new Vector2(1, 0);
		this.pos = this.pos.add(vector.rotate(this.angle).scale(this.speed));
		if(this.pos.x < -100 || this.pos.y < -100 || this.pos.x > 1360 || this.pos.y > 800 ) {
			this.remove();
		}
	};
	RailGunBullet.prototype.hitCheck = function() {
		
		makeEffect("ring_01").setSizeShift(1).setTransparentShift(-1).setPos(this.pos).setAngle(this.angle).build();
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= enemy.radius + this.radius) {
				enemy.damaged(this.damage);
			}
		}
	};
	
	return RailGunBullet;
})();