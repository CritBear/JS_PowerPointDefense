
function Tower( options ) {
	
	this.name = options.name;
	this.id = options.id;
	this.pos = options.pos;
	this.damage = towerInfo[options.name].damage;
	this.range = towerInfo[options.name].range;
	this.rate = towerInfo[options.name]..rate;
	this.cost = towerInfo[options.name].cost;
	this.radius = towerInfo[options.name].radius;
	this.imagesthis.bullet = towerInfo[options.name].bullet;
	
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