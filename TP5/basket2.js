"use strict";

let jsonFiles = ["fruits.json", "prices.json"];

let quantities = new Array();

function ajaxPromise(jsonPath)
{
	return new Promise((resolve, reject) =>
	{
		let ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function()
		{	
			let state = ajax.readyState;
			let responseText;

			if(ajax.readyState != 4)
			{
				return;
			}
			if(ajax.status != 200)
			{
				console.log("Error : " + ajax.status)
			}
			else
			{
				let data = JSON.parse(ajax.responseText);
				
				if(jsonPath == jsonFiles[0])
				{
					updateTable(data);
					updateQuantity(data);
				}
				else
				{
					updatePrice(data);
				}
			}
		}

		ajax.open("GET", jsonPath, true);
		ajax.overrideMimeType("application/json");
		ajax.send();
	});
}

// function jsonFile(jsonPath)
// {
// 	let ajax = new XMLHttpRequest();

// 	ajax.onreadystatechange = function()
// 	{	
// 		let state = ajax.readyState;
// 		let responseText;

// 		if(ajax.readyState != 4)
// 		{
// 			return;
// 		}

// 		if(ajax.status != 200)
// 		{
// 			console.log("Error : " + ajax.status)
// 		}
// 		else
// 		{
// 			let data = JSON.parse(ajax.responseText);
			
// 			if(jsonPath == jsonFiles[0])
// 			{
// 				updateTable(data);
// 				updateQuantity(data);
// 			}
// 			else
// 			{
// 				updatePrice(data);
// 			}
// 			// dictionnaire
			
// 		}
// 	}

// 	ajax.open("GET", jsonPath, true);
// 	ajax.overrideMimeType("application/json");
// 	ajax.send();
// }

function updateTable(data)
{
	let tableDiv = document.getElementById("basket");

	tableDiv.innerHTML += data.map((fruit) =>
		{
			return `<tr><td>${fruit.name}</td><td>${fruit.quantity}</td></tr>`;
		}).join('');
}

function updateQuantity(data)
{
	let quantityDiv = document.getElementById("quantity");
	let quantity = 0;

	quantity += data.map((fruit) =>
		{
			quantities.push(fruit.quantity);

			quantity += fruit.quantity;
			quantityDiv.innerHTML = quantity;
		});
}

function updatePrice(data)
{
	let priceDiv = document.getElementById("price");

	let price = 0;
	let prices = new Array();

	data.map((fruit) =>
		{
			prices.push(fruit.price);
		});

	for (var i = prices.length - 1; i >= 0; i--)
	{
		price += prices[i] * quantities[i];
	}

	priceDiv.innerHTML = price;	
}

// jsonFile(jsonFiles[0]);
// jsonFile(jsonFiles[1]);

ajaxPromise(jsonFiles[0])
	.then()
	.catch(err => console.log(err.message));

ajaxPromise(jsonFiles[1])
	.then()
	.catch(err => console.log(err.message));


/**

1.2
On utilise la console du navigateur pour voir si la requete est passée.

1.2
Sur firefox ça marche mais pas sur chrome, car chrome ne permet pas de faire des requetes de type get sur des fichiers locaux.
*/
