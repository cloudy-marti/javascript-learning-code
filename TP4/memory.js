'use strict'

class MemoryGame
{
	constructor(images, blank)
	{
		this.images = images;
		this.blank = blank;

		this.cards = shuffleCards(images.length);

		this.visibleCard = null;
		this.visibleCardDiv = null;

		this.discoveredCards = new Array();

		this.clickIsEnabled = true;
	}

	build(div)
	{
		for(let i = 0; i < this.cards.length; ++i)
		{
			div.innerHTML += "<img onclick=\"game.toggleOnClick(" + i + ", this);\" src = \"assets/" + this.blank + "\"/>";	
		}
	}

	toggleOnClick(index, imgDiv)
	{
		if(!this.clickIsEnabled)
		{
			return;
		}

		const path = "assets/" + this.images[this.cards[index]];
		console.log("\tpath = " + path);

		imgDiv.src = path;
		
		if(this.visibleCard == null)
		{
			this.visibleCard = index;
			this.visibleCardDiv = imgDiv;
		}
		else
		{
			if(this.visibleCard == index)
			{
				return;
			}
			
			// player has found a pair
			if(this.cards[this.visibleCard] == this.cards[index])
			{
				this.discoveredCards.push(this.cards[index]);
				
				this.visibleCard = null;
				this.visibleCardDiv = null;

				if(this.discoveredCards.length == this.images.length)
				{
					this.clickIsEnabled = false;
				}
			}
			else
			{
				this.clickIsEnabled = false;
				//settimeout va executer la fonction passé en parametre apres un timeout
				setTimeout( () =>
					{
						imgDiv.src = "assets/" + this.blank;
						this.visibleCardDiv.src = "assets/" + this.blank;

						this.visibleCard = null;
						this.visibleCardDiv = null;

						this.clickIsEnabled = true;
					}, 500
				);
			}
		}
	}
}

function random(max)
{
	return Math.floor(Math.random() * max);
}

function shuffleCards(length)
{
	let cards = [];

	for(let i = 0; i < 2*length; i++)
	{
		let j = random(i);

		cards[i] = cards[j];
		cards[j] = Math.floor(i/2);
	}
	console.log(cards);
	return cards;
}