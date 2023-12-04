//==================== Afficher les produits du localStorage sur la page ====================//

// ----- récupération des éléments stockés dans le localStorage
let cart = JSON.parse(localStorage.getItem("cart"));

// Sélection des éléments du DOM
const cartItems = document.getElementById("cart__items");
const cartOrder = document.querySelector(".cart__order");
const cartPrice = document.querySelector(".cart__price");
const deleteItem = document.getElementsByClassName("deleteItem");
const title = document.querySelector("h1");
const itemQty = document.getElementsByClassName("itemQuantity");

// ----- Définition des expressions régulières
const nameCheck = RegExp('^[a-zA-ZÀ-ÿ-\' ]{2,20}$');
const locationCheck = RegExp('^[a-zA-Z0-9À-ÿ-\' ]{2,50}$');
const emailCheck = RegExp('^[a-z0-9-]+@[a-z-]+\.[a-z]{2,6}$');

// ----- Si le panier est vide, ajuste le message et supprime le prix et le formulaire
function resetCart() {
	title.textContent += " ne contient aucun article";
	cartOrder.style.display = "none";
	cartPrice.style.display = "none";
}

// ----- Si le panier existe, création de chaque produit avec ses propriétés
function displayCartItems() {
	if (cart) {
		for (const el of cart) {
			const article = document.createElement("article");
			article.className = "cart__item";
			article.setAttribute("data-id", el.id);
			article.setAttribute("data-color", el.color);
			cartItems.appendChild(article);

			const divCartItemImg = document.createElement("div");
			divCartItemImg.setAttribute("class", "cart__item__img");
			article.appendChild(divCartItemImg);

			const image = document.createElement("img");
			image.src = el.image;
			image.alt = el.description;
			divCartItemImg.appendChild(image);

			const divCartItemContent = document.createElement("div");
			divCartItemContent.className = "cart__item__content";
			article.appendChild(divCartItemContent);

			const cartItemContentDescription = document.createElement("div");
			cartItemContentDescription.className = "cart__item__content__description";
			divCartItemContent.appendChild(cartItemContentDescription);

			const title = document.createElement("h2");
			title.textContent = el.name;
			cartItemContentDescription.appendChild(title);

			const color = document.createElement("p");
			color.textContent = el.color;
			cartItemContentDescription.appendChild(color);

			const price = document.createElement("p");
			price.textContent = el.price + " €";
			cartItemContentDescription.appendChild(price);

			const cartItemContentSettings = document.createElement("div");
			cartItemContentSettings.className = "cart__item__content__settings";
			divCartItemContent.appendChild(cartItemContentSettings);

			const cartItemContentSettingsQuantity = document.createElement("div");
			cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
			cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

			const quantity = document.createElement("p");
			quantity.textContent = "Qté : ";
			cartItemContentSettingsQuantity.appendChild(quantity);

			const input = document.createElement("input");
			input.setAttribute("type", "number");
			input.value = el.quantity;
			input.className = "itemQuantity";
			input.setAttribute("min", "1");
			input.setAttribute("max", "100");
			input.setAttribute("name", "itemQuantity");
			cartItemContentSettingsQuantity.appendChild(input);

			const cartItemContentSettingsDelete = document.createElement("div");
			cartItemContentSettingsDelete.className = "cart__item__content__settings__delete";
			cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

			const deleItem = document.createElement("p");
			deleItem.className = "deleteItem";
			deleItem.textContent = "Supprimer";
			cartItemContentSettingsDelete.appendChild(deleItem);
		};
		totalUpdate();

		// ----- Si non une indication est créé pour avertir que le panier est vide
	} else {
		resetCart();
	};
};

//=================== Calcul de la somme et de la quantité des éléments du panier ===================//

// ----- Calcul du prix des éléments du panier par rapport à leur quantité
function priceUpdate() {
	let sum = 0;
	for (const item of cart) {
		sum += (item.price * item.quantity);
	};
	document.getElementById("totalPrice").textContent = sum;
}

// ----- Calcul de la quantité des éléments du panier
function quantityUpdate() {
	let quantity = 0;
	for (const item of cart) {
		quantity += item.quantity;
	};
	document.getElementById("totalQuantity").textContent = quantity;
}

// ----- Mise à jour de la quantité et du prix des éléments dans le panier
function totalUpdate() {
	quantityUpdate();
	priceUpdate();
}

// =============================== Mise à jour des articles du panier =============================== //

// ----- Pour chaque article du panier, si la quantité change alors celle du localStorage change pour obtenir la même quantité
function updateCartQuantity() {
	for (let i = 0; i < itemQty.length; i++) {
		itemQty[i].addEventListener("change", (e) => {
			e.preventDefault();
			cart[i].quantity = parseInt(itemQty[i].value);
			localStorage.setItem("cart", JSON.stringify(cart));
			totalUpdate();
		});
	};
}

// =============================== Suppression des articles du panier =============================== //

// ----- Supression au clic de chacun des éléments du panier
function deleteCartItems() {
	for (let i = 0; i < deleteItem.length; i++) {
		deleteItem[i].addEventListener("click", (e) => {
			e.preventDefault();

			// ----- Si le message de confirmation est validé, le produit selectionné est supprimé et le total des articles du panier est recalculé
			if (confirm("supprimer l'article ?")) {
				deleteItem[i].closest("article").remove();
				let product = cart[i];
				delete cart[i];
				cart = cart.filter(el => product);
				localStorage.setItem("cart", JSON.stringify(cart));
				totalUpdate();

				if (!cart.length) {
					localStorage.clear();
					resetCart();
				}
			}
		});
	};
}

// =============================== Partie Formulaire =============================== //

document.querySelector(".cart__order__form").addEventListener("submit", function (e) {
	e.preventDefault();
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const address = document.getElementById("address").value;
	const city = document.getElementById("city").value;
	const email = document.getElementById("email").value;

	// ----- Vérification des champs du formulaire
	nameCheck.test(firstName)
		? document.getElementById("firstNameErrorMsg").textContent = ""
		: document.getElementById("firstNameErrorMsg").textContent = "Le prénom renseigné n'est pas valide";
	nameCheck.test(lastName)
		? document.getElementById("lastNameErrorMsg").textContent = ""
		: document.getElementById("lastNameErrorMsg").textContent = "Le nom renseigné n'est pas valide";
	locationCheck.test(address)
		? document.getElementById("addressErrorMsg").textContent = ""
		: document.getElementById("addressErrorMsg").textContent = "L'adresse renseignée n'est pas valide";
	locationCheck.test(city)
		? document.getElementById("cityErrorMsg").textContent = ""
		: document.getElementById("cityErrorMsg").textContent = "Le nom de ville renseigné n'est pas valide";
	emailCheck.test(email)
		? document.getElementById("emailErrorMsg").textContent = ""
		: document.getElementById("emailErrorMsg").textContent = "L'adresse email reseignée n'est valide";

	// ----- Si le panier est inexistant ou vide, l'envoi du formulaire est empêché
	if (cart === null || cart === 0 || cart === '') {
		e.preventDefault();
	} else if (nameCheck.test(firstName) && nameCheck.test(lastName) && locationCheck.test(address) && locationCheck.test(city) && emailCheck.test(email)) {

		const contact = { firstName: firstName, lastName: lastName, address: address, city: city, email: email };

		// ----- Création du tableau qui devra contenir l'id des articles du panier
		const products = [];

		// ----- L'id de chaque article du panier est transféré dans le tableau "products"
		for (const item of cart) {
			products.push(item.id)
		};

		// ----- Création du formulaire à soumettre à l'api
		const formToSend = { contact, products };

		// ----- Création de la méthode d'envoi du formlaire
		const options = {
			method: "POST",
			body: JSON.stringify(formToSend),
			headers: {
				"Content-Type": "application/json"
			}
		};

		// ----- Création de la requête "POST" à l'api, traduction au formation json puis enregistrement de la réponse dans le localStorage. Un redirection vers la page "confirmation" est effectuée si les promesses sont réussies
		fetch("https://kanap-api-04a6.onrender.com/api/products/order", options)
			.then(response => response.json())
			.then(data => {
				localStorage.setItem("orderId", data.orderId);
				window.location.replace("confirmation.html");
			})
			.catch(err => console.log("ERREUR " + err));

		// ----- Si le formulaire n'est pas valide, la validation est empêchée
	} else {
		e.preventDefault();
	};
});

displayCartItems();
updateCartQuantity();
deleteCartItems();