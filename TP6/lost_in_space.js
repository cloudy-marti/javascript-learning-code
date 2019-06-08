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

	bumps(spaceship)
	{
		if(this.px < spaceship.px + spaceship.sizeShip &&
			this.px + this.sizeShip > spaceship.px &&
			this.py < spaceship.py + spaceship.sizeShip &&
			this.sizeShip + this.py > spaceship.py)
		{
		    spaceship.isAlive = false;
		}
	}
}

class Bullet
{
	constructor(px, py, vy, vx)
	{
		this.px = px;
		this.py = py - 6;

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

		this.minimumVy = -0.1;

		this.radius = 1;
		this.color = "white";

		this.isAlive = true;
	}

	hits(spaceship)
	{
		if(this.px >= spaceship.px - 2.5 &&
			this.px <= spaceship.px + 2.5 &&
			this.py >= spaceship.py - 5 &&
			this.py <= spaceship.py)
		{
			spaceship.isAlive = false;
			this.isAlive = false;
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
		spacecraft.isGoingDown = true;
	}

	if(spacecraft.py > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.py = canvasWidth - spacecraft.sizeShip;
		spacecraft.vx *= -1.1;
		spacecraft.isGoingDown = false;
	}
}

function updatePositionBullet(bullet)
{
	bullet.py += bullet.vy;
	bullet.vy *= 0.99;

	if(bullet.vy > bullet.minimumVy)
	{
		bullet.vy = bullet.minimumVy;
	}

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

	let numberOfEnemies = 300;

	for(let index = 0; index < numberOfEnemies / 2; ++index)
	{
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), random(5, 1), 0, "green", false));
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), -1*random(5, 1), 0, "green", false));
	}
}

Space.clearBodies = () =>
{
	Space.enemies = Space.enemies.filter((ship) => ship.isAlive );

	Space.bullets = Space.bullets.filter((bullet) => bullet.isAlive );
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

			event.preventDefault();
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

	Space.bullets.forEach( (bullet, index) =>
	{
		updatePositionBullet(bullet);
	});

	Space.enemies.forEach( (ship, index) =>
	{
		updatePositionEnemy(ship, Space.xBound, Space.yBound);

		ship.bumps(Space.player);

		Space.bullets.forEach( (bullet, index) =>
		{
			bullet.hits(ship);
			bullet.hits(Space.player);
		})
	});

	Space.clearBodies();

	Space.context.clearRect(0, 0, Space.xBound, Space.yBound);
	View.drawAll([Space.player, ...Space.enemies], Space.bullets);

	if(!Space.player.isAlive || Space.enemies.length == 0)
	{
		Space.initializeSpace(Space.canvas, Space.context);
	}

	window.requestAnimationFrame(game);
}