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
		// switch(state)
		// {
		// 	case 1 :
		// 		responseText = "opened";
		// 		break;
		// 	case 2 :
		// 		responseText = "headers_received";
		// 		break;
		// 	case 3 :
		// 		responseText = "loading";
		// 		break;
		// 	case 4 :
		// 		responseText = "done";
		// 		break;
		// 	default :
		// 		break;
		let data = JSON.parse(ajax.responseText);
		console.log(data);
		// dictionnaire

		let table = document.getElementById("quantity");

		table.innerHTML += data.map((i) =>
			{
				`<tr><td>${i.name}</td><td>${i.name}</td></tr>`
			});
	}


	console.log(state + '  ' + responseText);
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