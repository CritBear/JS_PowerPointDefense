
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
	
	map.update();
	
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
	
	mouse.pos.x = e.pageX - canvas.offsetLeft;
	mouse.pos.y = e.pageY - canvas.offsetTop;
}

function mouseClick( e ) {
	
	mouse.click();
	
	for( var i = 0; i < objectList.UI.length; i++ ) {
		var ui = objectList.UI[i];
		if( ui.onClick && ui.able ) {
			if( mouse.pos.x > ui.pos.x && mouse.pos.x < ui.pos.x + ui.width && mouse.pos.y > ui.pos.y && mouse.pos.y < ui.pos.y + ui.height ) {
				ui.onClick();
				return;
			}
		}
	}
	
	for( var i = 0; i < objectList.tower.length; i++ ) {
		var tower = objectList.tower[i];
		if( tower.onClick ) {
			if( mouse.pos.distance( tower.pos ) <= tower.radius ) {
				tower.onClick();
				return;
			}
		}
	}
	
	if( getUIByName( "towerControlPanel" ).able ) {
		getUIByName( "towerControlPanel" ).able = false;
		getUIByName( "shopPanel" ).able = true;
	}
}

function setUI() {
	
	var btn_nextRound = makeButton( "btn_nextRound" ).setImage( gameManager.images.nextRound ).setSize( 70, 70 ).setPos( new Vector2( canvas.width - 270, 0 ) ).build();
	btn_nextRound.onClick = function() {
		console.log(objectList);
		gameManager.nextRound();
	};
	objectList.UI.push( btn_nextRound );
	
	var mainPanel = makePanel( "mainPanel" ).setPos( new Vector2( canvas.width - 200, 0 ) ).setSize( 200, 200 ).build();
	mainPanel.render = function() {
		if( !this.able ) {
			return;
		}
		ctx.save();
		ctx.globalAlpha = 0.7;
		ctx.fillStyle = "black";
		ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
		ctx.restore();
		
		ctx.drawImage( gameManager.images.money, this.pos.x + 10, this.pos.y + 50, 50, 50 );
		ctx.drawImage( gameManager.images.life, this.pos.x + 10, this.pos.y + 100, 50, 50 );
		
		ctx.save();
		ctx.fillStyle = "white";
		ctx.font = "20px Arial";
		ctx.fillText( gameManager.money, this.pos.x + 80, this.pos.y + 80 );
		ctx.fillText( gameManager.life, this.pos.x + 80, this.pos.y + 130 );
		ctx.font = "26px Arial";
		ctx.fillText( "Round " + gameManager.round, this.pos.x + 10, this.pos.y + 35 );
		ctx.restore();
	};
	objectList.UI.push( mainPanel );
	
	var shopPanel = makePanel( "shopPanel" ).setPos( new Vector2( canvas.width - 200, 200 ) ).setSize( 200, canvas.height - 200 ).build();
	shopPanel.render = function() {
		if( !this.able ) {
			return;
		}
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
		ctx.restore();
	};
	objectList.UI.push( shopPanel );
	
	var btn_basicTower = makeButton( "basicTower" ).setType( "shopTowerButton" ).setPos( new Vector2( canvas.width - 190, 300 ) ).setSize( 80, 80 ).build();
	var btn_iceTower = makeButton( "iceTower" ).setType( "shopTowerButton" ).setPos( new Vector2( canvas.width - 190, 400 ) ).setSize( 80, 80 ).build();
	var btn_spearTower = makeButton( "spearTower" ).setType( "shopTowerButton" ).setPos( new Vector2( canvas.width - 95, 400 ) ).setSize( 80, 80 ).build();
	
	shopPanel.addContent( btn_basicTower ).addContent( btn_iceTower ).addContent( btn_spearTower );
	
	var towerControlPanel = makePanel( "towerControlPanel" ).setPos( new Vector2( canvas.width - 200, 200 ) ).setSize( 200, canvas.height - 200 ).build();
	towerControlPanel.able = false;
	towerControlPanel.targetTower = undefined;
	towerControlPanel.render = function() {
		if( !this.able || !this.targetTower ) {
			return;
		}
		var target = this.targetTower;
		
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.arc( target.pos.x, target.pos.y, target.range, 0, Math.PI*2 );
		ctx.fillStyle = "#333";
		ctx.fill();
		ctx.globalAlpha = 1;
		
		ctx.filStlye = "#333";
		ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText( target.name, this.pos.x + 50, this.pos.y + 30 );
		ctx.drawImage( target.image, this.pos.x + this.width/2 - 50, this.pos.y + 40, 100, 100 );
		ctx.font = "16px Arial";
		ctx.fillText( "damage : " + target.damage, this.pos.x + 10, this.pos.y + 170 );
		ctx.fillText( "range : " + target.range, this.pos.x + 10, this.pos.y + 190 );
		ctx.fillText( "rate : " + target.rate, this.pos.x + 10, this.pos.y + 210 );
		if( target.debuff ) {
			ctx.fillText( "debuff : " + target.debuff, this.pos.x + 10, this.pos.y + 230 );
		}
		
		ctx.fillText("__Upgrade to_________", this.pos.x + 10, this.pos.y + 260 );
		ctx.restore();
	};
	objectList.UI.push( towerControlPanel );
	
	var btn_upgradeA = makeButton( "btn_upgradeA" ).setType( "upgradeButton" ).setSize( 80, 80 ).setPos( new Vector2( canvas.width - 190, canvas.height - 220 ) ).build();
	btn_upgradeA.parentUI = towerControlPanel;
	btn_upgradeA.num = 0;
	
	var btn_upgradeB = makeButton( "btn_upgradeB" ).setType( "upgradeButton" ).setSize( 80, 80 ).setPos( new Vector2( canvas.width - 95, canvas.height - 220 ) ).build();
	btn_upgradeB.parentUI = towerControlPanel;
	btn_upgradeB.num = 1;
	
	towerControlPanel.addContent( btn_upgradeA ).addContent( btn_upgradeB );
	
	var btn_sellTower = {
		name: "btn_sellTower",
		pos: new Vector2( canvas.width - 160, canvas.height - 50 ),
		width: 120,
		height: 40,
		parentUI: undefined,
		
		onClick: function() {
			this.parentUI.targetTower.sell();
		},
		start: function() {
			this.parentUI = getUIByName( "towerControlPanel" );
		},
		update: function() {
			this.render();
		},
		render: function() {
			ctx.save();
			ctx.fillStyle = "#FF5200";
			ctx.fillRect( this.pos.x, this.pos.y, this.width, this.height );
			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.fillText( "Sell : " + Math.floor( this.parentUI.targetTower.cost * 0.8), this.pos.x + 13, this.pos.y + 27);
			ctx.restore();
		},
	};
	towerControlPanel.contents.push( btn_sellTower );
}