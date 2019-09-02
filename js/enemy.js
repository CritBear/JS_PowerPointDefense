function Enemy( options ){
	this.id = options.id;
	this.name = options.name;
	this.pos = options.pos;
	this.offset = options.offset;
	this.maxHealth = options.maxHealth || 100;
	this.health = options.health || 100;
	this.direction = options.direction || new Vector2(0, 1);
	this.radius = 20;
	this.reward = options.reward;
	this.speed = options.speed;

	this.debuff= [];
}

Enemy.prototype.move = function () {
	this.pos = this.pos.add( this.direction.scale ( this.speed ) );
	for( var i = 0 ; i < map.turningPoint.length ; i++ ) {
		var turning = map.turningPoint[i];

		if(this.pos.distance( turning.pos ) <= turning.radius) {
			this.direction = turning.direction;			
		}
	}
	if ( collisionArcRect( this, map.end ) ) {
		gameManager.addLife( -1 );
		this.remove();
	}

};

Enemy.prototype.damaged = function ( value ) {
	this.health -= value;
	if( this.health <= 0 ) {
		gameManager.money += this.reward;
		gameManager.score += this.reward;
		this.remove();
	}
};

Enemy.prototype.remove = function () {
	
	for (var i = 0 ; i < objectList.enemy.length ; i++) {
			if( objectList.enemy[i] === this ) {
				objectList.enemy[i] = undefined;
			}
		}	
};

Enemy.prototype.setDebuff = function (debuff, duration) {

	for( var i = 0 ; i < this.debuff.length ; i++) {
		if( this.debuff[i].name === debuff ) {
			if( this.debuff[i].duration < duration ){
				this.debuff[i].duration = duration;
			}
			return;
		}
	}
	this.debuff.push( { name : debuff, duration : duration } );
};

Enemy.prototype.render = function () {
	
	ctx.save();
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, clamp(this.health/4,5,50), 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
};

var BasicEnemy = (function () {
	function BasicEnemy( options ) {
		Enemy.call(this, options);
	}

	BasicEnemy.prototype = Object.create( Enemy.prototype );
	BasicEnemy.prototype.constructor = BasicEnemy;

	BasicEnemy.prototype.update = function() {
		
		var isSlow = false;
		var isFrozen = false;

		if( this.debuff.length > 0) {
			for(var i = 0; i < this.debuff.length; i++) {
				if( !this.debuff[i] ) {
					continue;
				}

				switch( this.debuff[i].name ) {
					case "slow" :
						isSlow = true;
						break;
					case "frozen" :
						isFrozen = true;
						break;
					default :
						throw new Error("Wrong debuff name");
				}

				this.debuff[i].duration--;
				if(this.debuff[i].duration < 0) {
					this.debuff[i] = null;
				}
			}
			for(var i = 0; i < this.debuff.length; i++) {
				if(this.debuff[i] === null) {
					this.debuff.splice(i, 1);
					i = -1;
				}
			}
		}

		if( isFrozen ) {
		} else if( isSlow ){
			this.speed /= 4;
			this.move();
			this.speed *= 4;
		} else {
			this.move();
		}

		this.render()
	};

	return BasicEnemy;
	
}) ();