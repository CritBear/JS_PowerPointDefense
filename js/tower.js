
function Tower( options ) {
	
	this.name = options.name;
	this.id = options.id;
	this.pos = options.pos;
	this.damage = towerInfo[options.name].damage;
	this.range = towerInfo[options.name].range;
	this.rate = towerInfo[options.name].rate;
	this.cost = towerInfo[options.name].cost;
	this.radius = towerInfo[options.name].radius;
	this.image = towerInfo[options.name].image;
	this.bullet = towerInfo[options.name].bullet;
	
	this.targetId = undefined;
	this.fireCool = 0;
	this.angle = 0;
	this.upgradeList = [];
}

Tower.prototype.update = function() {
	
};
Tower.prototype.fire = function() {
	
};
Tower.prototype.upgrade = function( num ) {
	
	if( this.upgradeList[num] ) {
		makeTower( this.upgradeList[num] ).setPos( this.pos ).build();
		getUIByName( "towerControlPanel" ).able = false;
		getUIByName( "shopPanel" ).able = true;
		this.remove();
	}
};
Tower.prototype.sell = function() {
	
	gameManager.money += Math.floor( this.cost * 0.8 );
	getUIByName( "towerControlPanel" ).able = false;
	getUIByName( "shopPanel" ).able = true;
	this.remove();
};
Tower.prototype.onClick = function() {
	
	getUIByName( "shopPanel" ).able = false;
	getUIByName( "towerControlPanel" ).able = true;
	getUIByName( "towerControlPanel" ).targetTower = this;
};
Tower.prototype.render = function() {
	
	ctx.translate( this.pos.x, this.pos.y );
	ctx.rotate( this.angle );
	ctx.translate( -this.pos.x, -this.pos.y );
	ctx.drawImage( this.image, this.pos.x - this.radius, this.pos.y - this.radius, this.radius*2, this.radius*2 );
	ctx.translate( this.pos.x, this.pos.y );
	ctx.rotate( -this.angle );
	ctx.translate( -this.pos.x, -this.pos.y );
};

var BasicTower = (function() {
	
	function BasicTower( options ) {
		
		Tower.call( this, options );
		this.upgradeList = [ "fastTower", "cannonTower" ];
	}
	BasicTower.prototype = Object.create( Tower.prototype );
	BasicTower.prototype.constructor = BasicTower;
	
	BasicTower.prototype.update = function() {
		
		if( getEnemyById( this.targetId ) ) {
			var target = getEnemyById( this.targetId );
			if( this.pos.distance( target.pos ) <= this.range ) {
				this.angle = Math.atan2( target.pos.y - this.pos.y, target.pos.x - this.pos.x );
				if( this.fireCool <= 0 ) {
					this.fire();
				}
			} else {
				this.targetId = undefined;
			}
		} else {
			for( var i = 0; i < objectList.enemy.length; i++ ) {
				if( !objectList.enemy[i] ) {
					continue;
				}
				if( this.pos.distance( objectList.enemy[i].pos ) <= this.rnage ) {
					this.targetId = objectList.enemy[i].id;
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	BasicTower.prototype.fire = function() {
		
		var firePosOffset = new Vector2( 45, 0 ).rotate( this.angle );
		
		makeBullet( this.bullet ).setPos( this.pos.add( firePosOffset ) ).setTargetId( this.targetId ).setDamage( this.damage ).build();
		makeEffect( "fire_01" ).setSizeShift( -1 ).setTransparentShift( -1 ).setPos( this.pos.add( firePosOffset ) ).setAngle( this.angle ).build();
		this.fireCool = this.rate;
	};
	
	return BasicTower;
})();

var FastTower = (function() {
	
	function FastTower( options ) {
		
		Tower.call( this, options );
		this.upgradeList = [];
		this.fireCount = 0;
		this.firePosOffset = [ new Vector2( 55, -16 ), new Vector2( 55, 16 ) ];
	}
	FastTower.prototype = Object.create( Tower.prototype );
	FastTower.prototype.constructor = FastTower;
	
	FastTower.prototype.update = function() {
		
		if( getEnemyById( this.targetId ) ) {
			var target = getEnemyById( this.targetId );
			if( this.pos.distance( target.pos ) <= this.range ) {
				this.angle = Math.atan2( target.pos.y - this.pos.y, target.pos.x - this.pos.x );
				if( this.fireCool <= 0 ) {
					this.fire();
				}
			} else {
				this.targetId = undefined;
			}
		} else {
			for( var i = 0; i < objectList.enemy.length; i++ ) {
				if( !objectList.enemy[i] ) {
					continue;
				}
				if( this.pos.distance( objectList.enemy[i].pos ) <= this.rnage ) {
					this.targetId = objectList.enemy[i].id;
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	FastTower.prototype.fire = function() {
		
		var firePosOffset = this.firePosOffset[ this.fireCount ].rotate( this.angle );
		
		makeBullet( this.bullet ).setPos( this.pos.add( firePosOffset ) ).setTargetId( this.targetId ).setDamage( this.damage ).build();
		makeEffect( "fire_01" ).setSizeShift( -1 ).setTransparentShift( -1 ).setPos( this.pos.add( firePosOffset ) ).setAngle( this.angle ).build();
		this.fireCool = this.rate;
		this.fireCount = (this.fireCount + 1) % 2;
	};
	
	return FastTower;
})();

var CannonTower = (function() {
	
	function CannonTower( options ) {
		
		Tower.call( this, options );
		this.upgradeList = [ 'railGunTower' ];
	}
	CannonTower.prototype = Object.create( Tower.prototype );
	CannonTower.prototype.constructor = CannonTower;
	
	CannonTower.prototype.update = function() {
		
		if( getEnemyById( this.targetId ) ) {
			var target = getEnemyById( this.targetId );
			if( this.pos.distance( target.pos ) <= this.range ) {
				this.angle = Math.atan2( target.pos.y - this.pos.y, target.pos.x - this.pos.x );
				if( this.fireCool <= 0 ) {
					this.fire();
				}
			} else {
				this.targetId = undefined;
			}
		} else {
			for( var i = 0; i < objectList.enemy.length; i++ ) {
				if( !objectList.enemy[i] ) {
					continue;
				}
				if( this.pos.distance( objectList.enemy[i].pos ) <= this.rnage ) {
					this.targetId = objectList.enemy[i].id;
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	CannonTower.prototype.fire = function() {
		
		var firePosOffset = new Vector2(45, 0).rotate(this.angle);
		
		makeBullet( this.bullet ).setPos( this.pos.add( firePosOffset ) ).setTargetId( this.targetId ).setDamage( this.damage ).build();
		makeEffect( "fire_01" ).setSizeShift( -1 ).setTransparentShift( -1 ).setPos( this.pos.add( firePosOffset ) ).setAngle( this.angle ).build();
		this.fireCool = this.rate;
	};
	
	return CannonTower;
})();

var RailGunTower = (function() {
	
	function RailGunTower( options ) {
		
		Tower.call( this, options );
		this.upgradeList = [];
	}
	RailGunTower.prototype = Object.create( Tower.prototype );
	RailGunTower.prototype.constructor = RailGunTower;
	
	RailGunTower.prototype.update = function() {
		
		if( getEnemyById( this.targetId ) ) {
			var target = getEnemyById( this.targetId );
			if( this.pos.distance( target.pos ) <= this.range ) {
				this.angle = Math.atan2( target.pos.y - this.pos.y, target.pos.x - this.pos.x );
				if( this.fireCool <= 0 ) {
					this.fire();
				}
			} else {
				this.targetId = undefined;
			}
		} else {
			for( var i = 0; i < objectList.enemy.length; i++ ) {
				if( !objectList.enemy[i] ) {
					continue;
				}
				if( this.pos.distance( objectList.enemy[i].pos ) <= this.rnage ) {
					this.targetId = objectList.enemy[i].id;
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	RailGunTower.prototype.fire = function() {
		
		var firePosOffset = new Vector2(45, 0).rotate(this.angle);
		
		makeBullet( this.bullet ).setPos( this.pos.add( firePosOffset ) ).setTargetId( this.targetId ).setDamage( this.damage ).build();
		makeEffect( "fire_01" ).setSizeShift( -1 ).setTransparentShift( -1 ).setPos( this.pos.add( firePosOffset ) ).setAngle( this.angle ).build();
		this.fireCool = this.rate;
	};
	
	return RailGunTower;
})();

var IceTower = (function() {
	
	function IceTower( options ) {
		
		Tower.call( this, options );
		this.debuff = [ 'slow' ];
		this.upgradeList = [ 'frozenTower', 'iceBoltTower' ];
	}
	IceTower.prototype = Object.create( Tower.prototype );
	IceTower.prototype.constructor = IceTower;
	
	IceTower.prototype.update = function() {
		
		this.angle += 0.03;
		
		if(this.fireCool <= 0) {
			for(var i = 0; i < objectList.enemy.length; i++) {
				if(!objectList.enemy[i]) {
					continue;
				}
				if(this.pos.distance(objectList.enemy[i].pos) <= this.range) {
					this.fire();
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	IceTower.prototype.fire = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= this.range) {
				enemy.damaged(this.damage);
				this.debuff.forEach(function(debuff) {
					enemy.setDebuff(debuff, 50);
				});
			}
		}
		
		makeEffect('explosion_01').setSize(this.range * 2,this.range * 2).setPos(this.pos).setTransparentShift(-1).build();
		this.fireCool = this.rate;
	};
	
	return IceTower;
})();

var FrozenTower = (function() {
	
	function FrozenTower( options ) {
		
		Tower.call( this, options );
		this.debuff = [ 'frozen' ];
		this.upgradeList = [ 'blizzardTower' ];
	}
	FrozenTower.prototype = Object.create( Tower.prototype );
	FrozenTower.prototype.constructor = FrozenTower;
	
	FrozenTower.prototype.update = function() {
		
		this.angle += 0.03;
		
		if(this.fireCool <= 0) {
			for(var i = 0; i < objectList.enemy.length; i++) {
				if(!objectList.enemy[i]) {
					continue;
				}
				if(this.pos.distance(objectList.enemy[i].pos) <= this.range) {
					this.fire();
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	FrozenTower.prototype.fire = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			var enemy = objectList.enemy[i];
			if(this.pos.distance(enemy.pos) <= this.range) {
				enemy.damaged(this.damage);
				this.debuff.forEach(function(debuff) {
					enemy.setDebuff(debuff, 50);
				});
			}
		}
		
		makeEffect('explosion_03').setSize(this.range * 2,this.range * 2).setPos(this.pos).setTransparentShift(-1).build();
		this.fireCool = this.rate;
	};
	
	return FrozenTower;
})();

var IceBoltTower = (function() {
	
	function IceBoltTower( options ) {
		
		Tower.call( this, options );
		this.debuff = [ 'slow' ];
		this.upgradeList = [ 'icicleTower' ];
	}
	IceBoltTower.prototype = Object.create( Tower.prototype );
	IceBoltTower.prototype.constructor = IceBoltTower;
	
	IceBoltTower.prototype.update = function() {
		
		this.angle += 0.03;
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		} else {
			this.fire();
		}
		this.render();
	};
	IceBoltTower.prototype.fire = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			if(this.pos.distance(objectList.enemy[i].pos) <= this.range) {
				this.targetId = objectList.enemy[i].id;
				
				makeBullet(this.bullet).setPos(this.pos).setTargetId(this.targetId).setDamage(this.damage).build();
			}
		}
		
		this.fireCool = this.rate;
	};
	
	return IceBoltTower;
})();


var SpearTower = (function() {
	
	function SpearTower( options ) {
		
		Tower.call( this, options );
		this.upgradeList = [];
	}
	SpearTower.prototype = Object.create( Tower.prototype );
	SpearTower.prototype.constructor = SpearTower;
	
	SpearTower.prototype.update = function() {
		
		if( getEnemyById( this.targetId ) ) {
			var target = getEnemyById( this.targetId );
			if( this.pos.distance( target.pos ) <= this.range ) {
				this.angle = Math.atan2( target.pos.y - this.pos.y, target.pos.x - this.pos.x );
				if( this.fireCool <= 0 ) {
					this.fire();
				}
			} else {
				this.targetId = undefined;
			}
		} else {
			for( var i = 0; i < objectList.enemy.length; i++ ) {
				if( !objectList.enemy[i] ) {
					continue;
				}
				if( this.pos.distance( objectList.enemy[i].pos ) <= this.rnage ) {
					this.targetId = objectList.enemy[i].id;
					break;
				}
			}
		}
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		}
		this.render();
	};
	SpearTower.prototype.fire = function() {
		
		makeBullet(this.bullet).setPos(this.pos).setTargetId(this.targetId).setDamage(this.damage).build();
		this.fireCool = this.rate;
	};
	
	return SpearTower;
})();

var IcicleTower = (function() {
	
	function IcicleTower( options ) {
		
		Tower.call( this, options );
		this.debuff = [ 'slow', 'frozen' ];
		this.upgradeList = [];
	}
	IcicleTower.prototype = Object.create( Tower.prototype );
	IcicleTower.prototype.constructor = IcicleTower;
	
	IcicleTower.prototype.update = function() {
		
		this.angle += 0.03;
		
		if( this.fireCool > 0 ) {
			this.fireCool--;
		} else {
			this.fire();
		}
		this.render();
	};
	IcicleTower.prototype.fire = function() {
		
		for(var i = 0; i < objectList.enemy.length; i++) {
			if(!objectList.enemy[i]) {
				continue;
			}
			if(this.pos.distance(objectList.enemy[i].pos) <= this.range) {
				this.targetId = objectList.enemy[i].id;
				
				makeBullet(this.bullet).setPos(this.pos).setTargetId(this.targetId).setDamage(this.damage).build();
			}
		}
		
		this.fireCool = this.rate;
	};
	
	return IcicleTower;
})();
