"use strict";
 
// const directions =
// {
// 	UP: 0,
// 	DOWN: 1,
// 	LEFT: 2,
// 	RIGHT: 3
// }

class Player
{
	constructor(picture, canvas)
	{
		this.picture = picture;
		
		this.x = canvas.width / 2;
		this.y = canvas.height;

		this.vx = 0;
		this.vy = 0;

		this.ax = 0;
		this.ay = 0;

		console.log("x = " + this.x + "\ty = " + this.y);
	}


}



// class Enemy
// {
// 	constructor(x, y)
// 	{
// 		this.x = (x == 1)?canvas.width:0;
// 		this.y = y;
// 	}

// 	draw(context)
// 	{
// 		context.fill
// 	}
// }

// class Bullet
// {
// 	constructor()
// 	{

// 	}
// }

class Space
{
	constructor(canvas)
	{
		this.canvas = canvas;

		this.player = new Player("assets/dog.png", canvas);

		// this.enemies = new Array();
	}

	build(canvas)
	{
		let context = this.canvas.getContext("2d");
		window.view.draw(this.player, "cyan");
	}
}

class View
{
	constructor(canvas)
	{
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
	}

	drawPlayer(player, color)
	{
		this.context.beginPath();
		this.context.moveTo(player.x - 5, player.y);
		this.context.lineTo(player.x + 5, player.y);
		this.context.lineTo(player.x, player.y - 10);
		this.context.closePath();

		this.context.fillStyle = color;
		this.context.fill();
		
		this.context.fillStyle = "blue";
		this.context.fillRect(player.x - 2.5, player.y - 5, 5, 5);
	}

	drawEnemies()
	{
		this.context.fillStyle = "green";
		this.context.fillRect(300, 300, 5, 5);
	}
		
	draw(player, color)
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// this.context.drawImage(image, player.x, player.y, 50, 50);

		this.drawPlayer(player, color);
		this.drawEnemies();
	}
}

window.onload = function()
{
	let canvas = document.getElementById("game_area");
	console.log(canvas);
	
	let context = canvas.getContext("2d");
	window.view = new View(canvas);

	let game = new Space(canvas);

	game.build(canvas);

	window.setInterval(() =>
	{
		view.draw(game.player, "cyan");
	}, 16);

	let keysPressed = [];
	window.addEventListener("keydown", (event) =>
		{
			keysPressed[event.keyCode] = true;
			
			if(keysPressed[37])
			{
				// game.player.updatePosition(LEFT);
				game.player.ax -= 0.2;
				game.player.vx += game.player.ax;
				game.player.x += game.player.vx;
			}

			if(keysPressed[38])
			{
				// game.player.updatePosition(UP);
				game.player.ay -= 0.2;
				game.player.vy += game.player.ay;
				game.player.a += game.player.vy;
			}

			if(keysPressed[39])
			{
				// game.player.updatePosition(RIGHT);
				game.player.ax += 0.2;
				game.player.vx += game.player.ax;
				game.player.x += game.player.vx;
			}

			if(keysPressed[40])
			{
				// game.player.updatePosition(DOWN);
				game.player.ay += 0.2;
				game.player.ay += game.player.ay;
				game.player.y += game.player.vy;
			}

			console.log("x = " + game.player.x + "\ty = " + game.player.y);
		});

	window.addEventListener("keyup", (event) =>
		{
			keysPressed[event.keyCode] = false;
		});

	//window.view.draw(game.player, "cyan");

};