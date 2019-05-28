"use strict";

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
		console.log(data);
		// dictionnaire
		updateTable(data);
		updateQuantity(data);
	}
}

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

	quantityDiv.innerHTML = data.reduce((quantity, fruit) =>
		{
			return quantity + fruit.quantity;
		}, 0);
}

ajax.open("GET", "fruits.json", true);
ajax.overrideMimeType("application/json");
ajax.send();

/**

1.2
On utilise la console du navigateur pour voir si la requete est passée.

1.2
Sur firefox ça marche mais pas sur chrome, car chrome ne permet pas de faire des requetes de type get sur des fichiers locaux.
*/
