
function init() {
	
	canvas = document.createElement( "canvas" );
	ctx = canvas.getContext( "2d" );
	
	canvas.width = 1260;
	canvas.height = 700;
	canvas.style.backgroundColor = "#ddd";
	
	document.body.appendChild( canvas );
	
	window.addEventListener( "mousemove", mouseMove );
	window.addEventListener( "click", mouseClick );
	
	gameManager.initialize();
	
	setUI();
	
	start();
	
	update();
}

function start() {
	
	for( var key in objectList ) {
		var list = objectList[key];
		
		if( list instanceof Array ) {
			for( var i = 0; i < list.length; i++ ) {
				if( list[i] && list[i].start) {
					list[i].start();
				}
			}
		}
	}
}

function update() {
	
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	
	map.render();
	
	for( var key in objectList ) {
		var list = objectList[key];
		
		if( list === objectList.effect) {
			continue; //이펙트는 제일 앞에 그려져야 하니까
		}
		
		if( list instanceof Array ) {
			for( var i = 0; i < list.length; i++ ) {
				if( list[i] && list[i].update ) {
					list[i].update();
				}
			}
		}
	}
	
	objectList.effect.forEach( function( effect ) {
		if( effect && effect.update ) {
			effect.update();
		}
	});
	
	for( var key in objectList ) {
		var list = objectList[key];
		if( list instanceof Array ) {
			for( var i = 0; i < list.length; i++ ) {
				if( list[i] === null ) {
					list.splice( i, 1 );
					i = -1;
				}
			}
		}
	}
	
	mouse.update();
	
	gameManager.update();
}

function mouseMove( e ) {
	
}

function mouseClick( e ) {
	
}

function setUI() {
	
}