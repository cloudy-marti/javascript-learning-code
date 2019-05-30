"use strict";

class SpaceShip
{
	constructor(px, py, vx, vy, color, isPlayer)
	{		
		this.px = px;
		this.py = py;

		this.vx = vx;
		this.vy = vy;

		this.sizeShip = 5;
		this.color = color;

		this.isPlayer = isPlayer;
		this.isAlive = true;

		this.isGoingDown = true;
	}

	fire()
	{
		Space.bullets.push(new Bullet(this.px, this.py, this.vy, this.vx));
	}

	die()
	{
		this.isAlive = false;
	}
}

class Bullet
{
	constructor(px, py, vy, vx)
	{
		this.px = px;
		this.py = py;

		this.pyMax = py - (Space.yBound/2);

		if(vy == 0)
		{
			this.vy = vx;
		}
		else
		{
			this.vy = vy;
		}

		if(this.vy > 0)
		{
			this.vy = -this.vy;
		}
		else
		{
			this.vy = this.vy;
		}

		this.radius = 1;
		this.color = "white";

		this.isAlive = true;
	}

	hit(spaceship)
	{
		if(this.px >= spaceship.px - 2.5 &&
			this.px <= spaceship.px + 2.5 &&
			this.py >= spaceship.py - 5 &&
			this.py <= spaceship.py)
		{
			spaceship.isAlive = false;
			console.log("hit !");
		}
	}
}

function updatePositionPlayer(spacecraft, canvasWidth, canvasHeight)
{
	spacecraft.px += spacecraft.vx;
	spacecraft.py += spacecraft.vy;

	if(spacecraft.px < spacecraft.sizeShip ||
		spacecraft.px > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.vx *= -1;
	}

	if(spacecraft.py < spacecraft.sizeShip ||
		spacecraft.py > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.vy *= -1;
	}	
}

function updatePositionEnemy(spacecraft, canvasWidth, canvasHeight)
{
	spacecraft.px += spacecraft.vx;
	spacecraft.py += spacecraft.vy;

	if(spacecraft.px < spacecraft.sizeShip)
	{
		spacecraft.px = spacecraft.sizeShip;
		spacecraft.vx *= -1;

		if(spacecraft.isGoingDown)
		{
			spacecraft.py += 5;
		}
		else
		{
			spacecraft.py -= 5;
		}
	}

	if(spacecraft.px > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.px = canvasWidth - spacecraft.sizeShip;
		spacecraft.vx *= -1;

		if(spacecraft.isGoingDown)
		{
			spacecraft.py += 5;
		}
		else
		{
			spacecraft.py -= 5;
		}
	}
	
	if(spacecraft.py < spacecraft.sizeShip)
	{
		spacecraft.px = spacecraft.sizeShip;
		spacecraft.vx *= -1.1;
	}

	if(spacecraft.py > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.py = canvasWidth - spacecraft.sizeShip;
		spacecraft.vx *= -1.1;
	}
}

function updatePositionBullet(bullet)
{
	bullet.py += bullet.vy;
	bullet.vy *= 0.99;

	if(bullet.py <= bullet.pyMax)
	{
		bullet.isAlive = false;
	}
}

class View
{
	static drawSpaceCraft(spaceship)
	{
		const context = Space.context;
		let player = Space.player;

		context.beginPath();
		context.moveTo(spaceship.px - spaceship.sizeShip, spaceship.py);
		context.lineTo(spaceship.px + spaceship.sizeShip, spaceship.py);
		context.lineTo(spaceship.px, spaceship.py - (spaceship.sizeShip*2));
		context.closePath();

		context.fillStyle = spaceship.color;
		context.fill();
		
		/**
		 * Debug : draw the bounding box
		 */
		//context.fillStyle = "white";
		//context.fillRect(spaceship.px - 2.5, spaceship.py - 5, 5, 5);
	}

	static drawBullet(bullet)
	{
		const canvas = Space.canvas;
		const context = Space.context;

		context.beginPath();
		context.arc(bullet.px, bullet.py, 1, 0, 2*Math.PI);
		context.fillStyle = bullet.color;
		context.fill();
	}

	static drawAll(spaceships, bullets)
	{
		spaceships.forEach(View.drawSpaceCraft);
		bullets.forEach(View.drawBullet);
	}
}

const Space = {};
Space.initializeSpace = (canvas, context) =>
{
	Space.canvas = canvas;
	Space.context = context;

	Space.xBound = canvas.width;
	Space.yBound = canvas.height;

	Space.player = new SpaceShip(canvas.width / 2, canvas.height - 10, 0, 0, "cyan", true);

	Space.enemies = new Array();
	Space.bullets = new Array();

	let numberOfEnemies = 10;

	for(let index = 0; index < numberOfEnemies / 2; ++index)
	{
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), random(5, 1), 0, "green", false));
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), -1*random(5, 1), 0, "green", false));
	}
}

Space.clearBodies = () =>
{
	Space.enemies.forEach((spaceship, index) =>
		{
			if(!spaceship.isAlive)
			{
				Space.enemies.splice(index);
			}
		});

	Space.bullets.forEach((bullet, index) =>
		{
			if(!bullet.isAlive)
			{
				Space.bullets.splice(index);
			}	
		});
}

function random(max, min = 0)
{
	return min + Math.floor(Math.random()*(max-min));
}

window.onload = function()
{
	const canvas = document.getElementById("game_area");
	canvas.style.position = 'absolute';
	const context = canvas.getContext("2d");

	Space.initializeSpace(canvas, context);

	let keysPressed = [];
	window.addEventListener("keydown", (event) =>
		{
			keysPressed[event.keyCode] = true;

			if(keysPressed[32])
			{
				Space.player.fire();
			}
			
			if(keysPressed[37])
			{
				Space.player.vx -= 0.2;
			}

			if(keysPressed[38])
			{
				Space.player.vy -= 0.2;
			}

			if(keysPressed[39])
			{
				Space.player.vx += 0.2;
			}

			if(keysPressed[40])
			{
				Space.player.vy += 0.2;
			}

			//event.preventDefault();
		});

	window.addEventListener("keyup", (event) =>
		{
			keysPressed[event.keyCode] = false;
			Space.player.vy *= 0.5;
			Space.player.vx *= 0.5;
		});

	window.requestAnimationFrame(game);
};

function game(timestamp)
{
	updatePositionPlayer(Space.player, Space.xBound, Space.yBound);

	Space.enemies.forEach( (ship, index) =>
	{
		//updatePositionEnemy(ship, Space.xBound, Space.yBound);
	});

	Space.bullets.forEach( (bullet, index) =>
	{
		updatePositionBullet(bullet);
	});

	Space.clearBodies();

	Space.context.clearRect(0, 0, Space.xBound, Space.yBound);
	View.drawAll([Space.player, ...Space.enemies], Space.bullets);

	window.requestAnimationFrame(game);
}