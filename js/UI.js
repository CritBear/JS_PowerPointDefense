
function getUIByName( name ) {
	
	if( name ) {
		for(var i = 0; i < objectList.UI.lengh; i++) {
			if(objectList.UI[i].name === name) {
				return objectList.UI[i];
			}
		}
	}
	return false;
}

function makePanel( name ) {
	
	var options = {};
	
	options.name = name;
	
	return {
		setPos: function( v ) {
			if(v instanceof Vector2) {
				options.pos = v;
				return this;
			}
		},
		setSize: function( w, h ) {
			options.width = w;
			options.height = h;
			return this;
		},
		build: function() {
			return new Panel( options );
		}
	}
}

var Panel = (function () {
	
	function Panel( options ) {
		this.name = options.name;
		this.pos = options.pos;
		this.able = true;
		this.width = options.width;
		this.height = options.height;
		this.contents = [];
	}
	
	Panel.prototype.start = function() {
		
		for(var i = 0; i < this.contents.length; i++) {
			if(this.contents[i].start) {
				this.contents[i].start();
			}
		}
	};
	Panel.prototype.update = function() {
		
		if(!this.able) {
			return;
		}
		this.render();
		
		this.contents.forEach(function( content ) {
			if(content.update) {
				content.update();
			}
		});
	};
	Panel.prototype.onClick = function() {
		
		if(!this.able) {
			return;
		}
		
		this.contents.forEach(function( content ) {
			if(content.onClick) {
				if(collisionPointRect(mouse, content)) {
					//클릭된후 실행할 것들
					//밑에꺼랑 둘중에 하나 잘되는 걸로
				}
			}
		});
		for(var i = 0; i < this.contents.length; i++) {
			if(this.contents[i].onClick) {
				var obj = this.contents[i];
				if(mouse.pos.x > obj.pos.x && mouse.pos.x < obj.pos.x + obj.width && mouse.pos.y > obj.pos.y && mouse.pos.y < obj.pos.y + obj.height) {
					obj.onClick();
				}
			}
		}
	};
	Panel.prototype.addContent = function( content ) {
		
		this.contents.push( content );
		return this;
	};
	Panel.prototype.render = function() {
		
		console.log("Write code about this Panel.render");
	};
	
	return Panel;
})();

function makeButton( name ) {
	
	var options = {};
	
	options.name = name;
	
	return {
		setPos: function( v ) {
			if(v instanceof Vector2) {
				options.pos = v;
				return this;
			}
		},
		setSize: function( w, h ) {
			options.width = w;
			options.height = h;
			return this;
		},
		setType: function( type ) {
			options.type = type;
			return this;
		},
		setImage: function( image ) {
			options.image = image;
			return this;
		},
		build: function() {
			switch( options.type ) {
				case "shopTowerButton":
					return new ShopTowerButton( options );
					break;
				case "upgradeButton":
					return new UpgradeButton( options );
					break;
				default:
					return new Button( options );
			}
		}
	}
}

var ShopTowerButton = (function() {
	
	function ShopTowerButton( options ) {
		this.name = options.name;
		this.pos = options.pos;
		this.able = true;
		this.width = options.width;
		this.height = options.height;
	}
	
	ShopTowerButton.prototype.update = function() {
		
		this.render();
	};
	ShopTowerButton.prototype.onClick = function() {
		
		if(!this.able) {
			return;
		}
		
		if(mouse.isLocating) {
			if(mouse.locatingTower.name === this.name) {
				mouse.isLocating = false;
			} else {
				if(gameManager.money < towerInfo[this.name].cost) {
					return;
				}
				mouse.setLocatingTower(this.name);
			}
		} else {
			if(gameManager.money < towerInfo[this.name].cost) {
				return;
			}
			mouse.setLocatingTower(this.name);
		}
	};
	ShopTowerButton.prototype.render = function() {
		
		ctx.save();
		if(gameManager.money < towerInfo[this.name].cost) {
			ctx.globalAlpha = 0.3;
		}
		ctx.fillStyle = "white";
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		ctx.drawImage(towerInfo[this.name].image, this.pos.x, this.pos.y, this.width, this.height);
		
		ctx.globalAlpha = 1;
		ctx.fillStyle = "white";
		ctx.font = "14px Arial";
		ctx.fillText(towerInfo[this.name].cost, this.pos.x, this.pos.y + this.height + 15);
		ctx.restore();
	};
	
	return ShopTowerButton;
})();

var UpgradeButton = (function() {
	
	function UpgradeButton( options ) {
		this.name = options.name;
		this.pos = options.pos;
		this.able = true;
		this.width = options.width;
		this.height = options.height;
		this.image = options.image || undefined;
		this.parentUI = undefined;
		this.num = undefined;
		this.tower = undefined;
	}
	
	UpgradeButton.prototype.update = function() {
		
		this.tower = this.parentUI.targetTower;
		this.render();
	};
	UpgradeButton.prototype.onClick = function() {
		
		if(gameManager.money >= towerInfo[this.tower.upgradeList[this.num]].cost - this.tower.cost) {
			gameManager.money -= towerInfo[this.tower.upgradeList[this.num]].cost - this.tower.cost
			this.parentUI.targetTower.upgrade(this.num);
		}
	};
	UpgradeButton.prototype.render = function() {
		
		if(this.tower.upgradeList && this.tower.upgradeList[this.num]) {
			if(gameManager.money < towerInfo[this.tower.upgradeList[this.num]].cost - this.tower.cost) {
				ctx.globalAlpha = 0.3;
			}
			ctx.drawImage(towerInfo[this.tower.upgradeList[this.num]].image, this.pos.x, this.pos.y, this.width, this.height);
			ctx.globalAlpha = 1;
			ctx.fillStyle = "white";
			ctx.font = "14px Arial";
			ctx.fillText(towerInfo[this.tower.upgradeList[this.num]].cost = this.tower.cost, this.pos.x, this.pos.y + this.height + 15);
		}
	};
	
	return UpgradeButton;
})();

var Button = (function() {
	
	function Button( options ) {
		this.name = options.name;
		this.pos = options.pos;
		this.able = true;
		this.width = options.width;
		this.height = options.height;
		this.image = options.image || undefined;
	}
	
	Button.prototype.update = function() {
		
		this.render();
	};
	Button.prototype.onClick = function() {
		
		console.log("Write code about this button.render");
	};
	Button.prototype.render = function() {
		
		if(this.image) {
			ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
		} else {
			ctx.fillStyle = "#eee";
			ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		}
	};
	
	return Button;
})();