"use strict";

class SpaceShip
{
	constructor(px, py, vx, vy)
	{		
		this.px = px;
		this.py = py;

		this.vx = vx;
		this.vy = vy;

		this.sizeShip = 5;

		this.isAlive = true;

		this.isGoingDown = true;
	}

	fire()
	{

	}
}

class bullets
{
	constructor(px, py, vx, vy)
	{
		this.px = px;
		this.py = py;

		this.pyMax = py - Space.yBound/2;
		
		this.vx = vx;
		this.vy = vy;

		this.exists = true;
	}
}

function updatePositionPlayer(spacecraft, canvasWidth, canvasHeight)
{
	spacecraft.px += spacecraft.vx;
	spacecraft.py += spacecraft.vy;

	if(spacecraft.px < spacecraft.sizeShip || spacecraft.px > canvasWidth - spacecraft.sizeShip)
	{
		spacecraft.vx *= -1;
	}

	if(spacecraft.py < spacecraft.sizeShip || spacecraft.py > canvasWidth - spacecraft.sizeShip)
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

const Space = {};
Space.initializeSpace = (canvas, context) =>
{
	Space.canvas = canvas;
	Space.context = context;

	Space.xBound = canvas.width;
	Space.yBound = canvas.height;

	Space.player = new SpaceShip(canvas.width / 2, canvas.height - 10, 0, 0);

	Space.enemies = new Array();
	Space.bullets = new Array();

	let numberOfEnemies = 300;

	for(let index = 0; index < numberOfEnemies / 2; ++index)
	{
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), random(5, 1), 0));
		Space.enemies.push(new SpaceShip(random(Space.xBound - 20, 10), random(Space.yBound/2), -1*random(5, 1), 0));
	}
}

function random(max, min = 0)
{
	return min + Math.floor(Math.random()*(max-min));
}

class View
{
	static drawSpaceCraft(spaceship, color)
	{
		const context = Space.context;
		let player = Space.player;

		context.beginPath();
		context.moveTo(spaceship.px - spaceship.sizeShip, spaceship.py);
		context.lineTo(spaceship.px + spaceship.sizeShip, spaceship.py);
		context.lineTo(spaceship.px, spaceship.py - (spaceship.sizeShip*2));
		context.closePath();

		context.fillStyle = color;
		context.fill();
		
		context.fillStyle = color;
		context.fillRect(spaceship.px - 2.5, spaceship.py - 5, 5, 5);
	}
		
	static draw(player)
	{
		const canvas = Space.canvas;
		const context = Space.context;

		View.drawSpaceCraft(player, `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`);
	}

	static drawAll(spaceships)
	{
		spaceships.forEach(View.draw);
	}
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

	Space.enemies.forEach( (ship, index) =>
	{
		updatePositionEnemy(ship, Space.xBound, Space.yBound);
	});

	Space.context.clearRect(0, 0, Space.xBound, Space.yBound);
	View.drawAll([Space.player, ...Space.enemies]);

	window.requestAnimationFrame(game);
}