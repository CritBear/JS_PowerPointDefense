
Vector2 = function( x, y ) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector2.prototype = {
	
	set: function( x, y ) {
		this.x = x || 0;
		this.y = y || 0;
	},
	
	clone: function() {
		return new Vector2( this.x, this.y );
	},
	
	add: function( v ) {
		if( v instanceof Vector2 ) {
			return new Vector2( this.x + v.x, this.y + v.y );
		} else {
			return new Vector2( this.x + v, this.y + v );
		}
	},
	
	scale: function( scalar ) {
		return new Vector2( this.x * scalar, this.y * scalar );
	},
	
	dot: function( vector ) {
		return ( this.x * vector.x + this.y * vector.y );
	},
	
	distance: function( vector ) {
		return Math.sqrt( this.distanceSqr( vector ) );
	},
	
	distanceSqr: function( vector ) {
		var deltaX = this.x - vector.x;
		var deltaY = this.y - vector.y;
		return ( deltaX * deltaX + deltaY * deltaY );
	},
	
	normalize: function() {
		var mag = this.magnitude();
		var vector = this.clone();
		if( Math.abs( mag ) < 1e-9 ) {
			vector.x = 0;
			vector.y = 0;
		} else {
			vector.x /= mag;
			vector.y /= mag;
		}
		return vector;
	},
	
	magnitude: function() {
		return Math.sqrt( this.magnitudeSqr() );
	},
	
	magnitudeSqr: function() {
		return ( this.x * this.x + this.y * this.y );
	},
	
	angle: function() {
		return Math.atan2( this.y, this.x );
	},
	
	rotate: function( alpha ) {
		var cos = Math.cos( alpha );
		var sin = Math.sin( alpha );
		var vector = new Vector2();
		vector.x = this.x * cos - this.y * sin;
		vector.y = this.x * sin + this.y * cos;
		
		return vector;
	},
}