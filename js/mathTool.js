
function collisionArcRect( arc, rect ) {
	
	var distX = Math.abs( arc.pos.x - rect.pos.x - rect.width / 2 );
	var distY = Math.abs( arc.pos.y - rect.pos.y - rect.height / 2 );
	
	if( distX > ( rect.width / 2 + arc.radius ) ) {
		return false;
	}
	
	if( distY > (rect.height / 2 + arc.radius ) ) {
		return false;
	}
	
	if( distX <= ( rect.width / 2 ) ) {
		return true;
	}
	
	if( distY <= ( rect.height / 2 ) ) {
		return true;
	}
	
	var dx = distX - rect.width / 2;
	var dy = distY - rect.height / 2;
	
	return ( dx * dx + dy * dy <= ( arc.radius * arc.radius ) );
}

function collisionArcArc( arc1, arc2 ) {
	
	return ( arc1.pos.distance( arc2.pos ) < arc1.radius + arc2.radius );
}

function collisionPointRect( point, rect ) {
	
	return ( point.pos.x > rect.pos.x && point.pos.x < rect.pos.x + rect.width && point.pos.y > rect.pos.y && point.pos.y < rect.pos.y + rect.height );
}

function clamp( value, min, max ) {
	
	return Math.max( min, Math.min( value, max ) );
}