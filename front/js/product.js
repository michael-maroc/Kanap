// Récupération de l'id du produit affiché sur la page
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Sélection des éléments du DOM
const quantity = document.getElementById("quantity");
const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colorSelect = document.getElementById("colors");
const btn = document.getElementById("addToCart");
const options = document.getElementById("colors");

// Fonctions de gestion du panier
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart === null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}
function addToCart(product) {
  let cart = getCart();
  const duplicate = cart.find(el => el.id === product.id && el.color === product.color)
  if (duplicate !== undefined) {
    duplicate.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

// Utilisation de l'url pour la requête à l'API puis affichage des données en conséquence
async function fetchItem() {
  await fetch(`https://kanap-api-04a6.onrender.com/api/products/${productId}`)
    .then(res => res.json())
    .then(productItem => {

      const productImg = document.createElement("img");
      productImg.src = productItem.imageUrl;
      productImg.alt = productItem.altTxt;
      itemImg.appendChild(productImg);

      title.textContent = productItem.name;
      price.textContent = productItem.price;
      description.textContent = productItem.description;

      for (let i = 0; i < productItem.colors.length; i++) {
        let productColors = document.createElement("option");
        productColors.setAttribute("value", productItem.colors[i]);
        productColors.textContent = productItem.colors[i];
        colorSelect.appendChild(productColors);
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let product = {
          id: productItem._id,
          image: productItem.imageUrl,
          name: productItem.name,
          price: productItem.price,
          quantity: parseInt(quantity.value),
          color: colors.value,
        };

        // Vérification des champs requis avant validation
        if (options.value === "") {
          return alert("Vous n'avez pas choisi de couleur pour votre article");
        }
        if (quantity.value <= 0 || quantity.value > 100) {
          return alert("La quantité selectionnée ne peut être inférieure à 1 et supérieure à 100");
        }
        addToCart(product);
        alert('Votre produit à bien été ajouté à votre panier');

      });
    }).catch(err => console.log(`Error: ${err}`));
}
fetchItem();