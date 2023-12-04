// ----- Récupération des donénes enregistrées dans le localStorage
const serverResponse = localStorage.getItem("orderId");
const orderId = document.getElementById("orderId");

// ----- Envoi de la réponse du serveur dans la page pour afficher le numéro de commande
orderId.textContent = serverResponse;

localStorage.clear();