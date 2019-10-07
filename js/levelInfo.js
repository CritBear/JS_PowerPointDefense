function Round(num, health, speed, rate, reward, stageReward) {

	this.num = num;
	this.health = health;
	this.speed = speed;
	this.rate = rate;
	this.reward = reward;
	this.stageReward = stageReward;
}

var roundInfo = [
	new Round(10, 30, 3, 10, 10, 100),
	new Round(10, 40, 3, 10, 10, 100),
	new Round(10, 50, 3, 10, 10, 100),
	new Round(15, 50, 4, 10, 10, 100),
	new Round(15, 70, 4, 10, 10, 100),
	new Round(15, 100, 4, 10, 10, 100),
	new Round(15, 130, 5, 10, 10, 100),
	new Round(15, 160, 5, 10, 10, 100),
	new Round(15, 190, 5, 10, 10, 100),
	new Round(15, 210, 5, 10, 10, 100),
	new Round(15, 240, 5, 10, 10, 100),
	new Round(15, 300, 5, 10, 10, 100),
	new Round(15, 350, 5, 10, 10, 100),
	new Round(15, 400, 5, 10, 10, 100),
	new Round(15, 500, 5, 10, 10, 100),
	new Round(15, 600, 5, 10, 10, 100),
	new Round(15, 700, 5, 10, 10, 100),
];

var towerInfo = {

	loadImage: function() {

		this.basicBullet.image.src = "images/basicBullet.png";
		this.iceBullet.image.src = "images/iceBullet.png";
		this.spearBullet.image.src = "images/spearBullet.png";
		this.icicleBullet.image.src = "images/icicleBullet.png";
		this.cannonBullet.image.src = "images/cannonBullet.png";
		this.railGunBullet.image.src = "images/railGunBullet.png";

		this.basicTower.image.src = "images/basicTower.png";
		this.fastTower.image.src = "images/fastTower.png";
		this.iceTower.image.src = "images/iceTower.png";
		this.spearTower.image.src = "images/spearTower.png";
		this.cannonTower.image.src = "images/cannonTower.png";
		this.frozenTower.image.src = "images/frozenTower.png";
		this.iceBoltTower.image.src = "images/iceBoltTower.png";
		this.blizzardTower.image.src = "images/blizzardTower.png";
		this.icicleTower.image.src = "images/icicleTower.png";
		this.railGunTower.image.src = "images/railGunTower.png";
	},

	basicBullet: {
		width: 70,
		height: 3,
		radius: 3,
		speed: 30,
		image: new Image(),
	},
	iceBullet: {
		width: 90,
		height: 30,
		radius: 3,
		speed: 15,
		image: new Image(),
	},
	spearBullet: {
		width: 100,
		height: 10,
		radius: 3,
		speed: 20,
		image: new Image(),
	},
	icicleBullet: {
		width: 100,
		height: 10,
		radius: 3,
		speed: 20,
		image: new Image(),
	},
	cannonBullet: {
		width: 100,
		height: 20,
		radius: 3,
		speed: 30,
		range: 100,
		image: new Image(),
	},
	railGunBullet: {
		width: 50,
		height: 30,
		radius: 5,
		speed: 50,
		range: 30,
		image: new Image(),
	},

	basicTower: {
		damage: 10,
		range: 300,
		rate: 30,
		cost: 120,
		radius: 40,
		image: new Image(),
		bullet: "basicBullet",
	},
	fastTower: {
		damage: 4,
		range: 400,
		rate: 6,
		cost: 180,
		radius: 40,
		image: new Image(),
		bullet: "basicBullet",
	},
	iceTower: {
		damage: 5,
		range: 150,
		rate: 100,
		cost: 160,
		radius: 40,
		image: new Image(),
		bullet: "",
	},
	spearTower: {
		damage: 1,
		range: 300,
		rate: 100,
		cost: 280,
		radius: 50,
		image: new Image(),
		bullet: "spearBullet",
	},
	cannonTower: {
		damage: 70,
		range: 400,
		rate: 70,
		cost: 240,
		radius: 50,
		image: new Image(),
		bullet: "cannonBullet",
	},
	railGunTower: {
		damage: 100,
		range: 400,
		rate: 100,
		cost: 250,
		radius: 50,
		image: new Image(),
		bullet: "railGunBullet",
	},
	frozenTower: {
		damage: 30,
		range: 300,
		rate: 70,
		cost: 1000,
		radius: 40,
		image: new Image(),
		bullet: "",
	},
	iceBoltTower: {
		damage: 10,
		range: 200,
		rate: 70,
		cost: 550,
		radius: 40,
		image: new Image(),
		bullet: "iceBullet",
	},
	blizzardTower: {
		damage: 30,
		range: 300,
		rate: 70,
		cost: 1000,
		radius: 40,
		image: new Image(),
		bullet: "iceBullet",
	},
	icicleTower: {
		damage: 0.3,
		range: 200,
		rate: 100,
		cost: 1070,
		radius: 50,
		image: new Image(),
		bullet: "icicleBullet",
	},
};

var effectInfo = {

	loadImage: function() {

		this.fire_01.image.src = "images/Eff_fire_01.png";
		this.hit_01.image.src = "images/Eff_hit_01.png";
		this.hit_02.image.src = "images/Eff_hit_02.png";
		this.explosion_01.image.src = "images/Eff_explosion_01.png";
		this.explosion_02.image.src = "images/Eff_explosion_02.png";
		this.explosion_03.image.src = "images/Eff_explosion_03.png";
		this.ring_01.image.src = "images/Eff_ring_01.png";
		this.fire_02.image.src = "images/Eff_fire_02.png";
	},

	fire_01: {
		width: 50,
		height: 10,
		duration: 20,
		image: new Image(),
	},
	fire_02: {
		width: 100,
		height: 100,
		duration: 20,
		image: new Image(),
	},
	hit_01: {
		width: 250,
		height: 250,
		duration: 10,
		image: new Image(),
	},
	hit_02: {
		width: 100,
		height: 100,
		duration: 10,
		image: new Image(),
	},
	explosion_01: {
		width: 200,
		height: 200,
		duration: 50,
		image: new Image(),
	},
	explosion_02: {
		width: 200,
		height: 200,
		duration: 50,
		image: new Image(),
	},
	explosion_03: {
		width: 200,
		height: 200,
		duration: 50,
		image: new Image(),
	},
	ring_01: {
		width: 30,
		height: 100,
		duration: 100,
		image: new Image(),
	},
	ring_02: {
		width: 30,
		height: 100,
		duration: 100,
		image: new Image(),
	},
};