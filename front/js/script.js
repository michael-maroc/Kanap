// ----- Création d'une classe qui regroupe toutes les clés et valeurs
class Article {
	constructor(index) {
		index && Object.assign(this, index);
	}
}

const items = document.getElementById("items");

// ----- Envoi d'une requete de type 'GET' à l'api
function getProducts() {
	fetch("https://kanap-api-8esl.onrender.com/api/products")
		.then(response => response.json())
		.then(data => {
			for (let index of data) {
				const product = new Article(index);

				const articleLink = document.createElement("a");
				articleLink.href = "./html/product.html?id=" + product._id;
				items.appendChild(articleLink);

				const article = document.createElement("article");
				articleLink.appendChild(article);

				const articleImage = document.createElement("img");
				articleImage.src = product.imageUrl;
				articleImage.alt = product.altTxt;
				article.appendChild(articleImage);

				const articleTitle = document.createElement("h3");
				articleTitle.className = product.name;
				articleTitle.textContent = product.name;
				article.appendChild(articleTitle);

				const articleDescription = document.createElement("p");
				articleDescription.className = product.description;
				articleDescription.textContent = product.description;
				article.appendChild(articleDescription);
			}
		})
		.catch(err => console.log("ERREUR " + err));
}
getProducts();