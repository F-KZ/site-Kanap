// récupération de l'id de la commande
function getConfirmationData() {
    const str = window.location.href;
    const url = new URL(str);
    const orderId = url.searchParams.get("orderId");
    const orderIdElement = document.getElementById('orderId');
    orderIdElement.innerHTML = orderId;
}

getConfirmationData();
