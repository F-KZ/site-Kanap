/* Initialisation du local storage */
let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
console.table(produitLocalStorage);
const positionEmptyCart = document.querySelector("#cart__items");

// Récupération des articles de l'API
function updateCartWithProducts(article, currentProductIndex) {
    // Insertion de l'élément "article"
    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute('data-id', produitLocalStorage[currentProductIndex].idProduit);

    // Insertion de l'élément "div"
    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    // Insertion de l'image
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = produitLocalStorage[currentProductIndex].imgProduit;
    productImg.alt = produitLocalStorage[currentProductIndex].altImgProduit;

    // Insertion de l'élément "div"
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    // Insertion de l'élément "div"
    let productItemContentTitlePrice = document.createElement("div");
    productItemContent.appendChild(productItemContentTitlePrice);
    productItemContentTitlePrice.className = "cart__item__content__titlePrice";

    // Insertion du titre h3
    let productTitle = document.createElement("h2");
    productItemContentTitlePrice.appendChild(productTitle);
    productTitle.innerHTML = produitLocalStorage[currentProductIndex].nomProduit;

    // Insertion de la couleur
    let productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = produitLocalStorage[currentProductIndex].couleurProduit;
    productColor.style.fontSize = "20px";

    // Insertion du prix
    let productPrice = document.createElement("p");
    productItemContentTitlePrice.appendChild(productPrice);
    productPrice.innerHTML = article.price + " €";

    // Insertion de l'élément "div"
    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    // Insertion de l'élément "div"
    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

    // Insertion de "Qté : "
    let productQte = document.createElement("p");
    productItemContentSettingsQuantity.appendChild(productQte);
    productQte.innerHTML = "Qté : ";

    // Insertion de la quantité
    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = produitLocalStorage[currentProductIndex].quantiteProduit;
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");
    productQuantity.setAttribute("name", "itemQuantity");

    // Insertion de l'élément "div"
    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    // Insertion de "p" supprimer
    let productSupprimer = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupprimer);
    productSupprimer.className = "deleteItem";
    productSupprimer.innerHTML = "Supprimer";
}

function Totals(prixProduits) {
    /* Récupération du total des quantités */
    let elemsQtt = document.getElementsByClassName('itemQuantity');
    let myLength = elemsQtt.length,
        totalPrice = 0;

    for (let i = 0; i < myLength; ++i) {
        totalPrice += elemsQtt[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalPrice;


    /* Récupération du prix total */
    totalPrice = 0;

    for (let i = 0; i < myLength; ++i) {
        totalPrice += (elemsQtt[i].valueAsNumber *prixProduits[i]);
    }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;

}

/* Si le panier est vide */
function ProductsCart() {
    if (produitLocalStorage === null || produitLocalStorage === 0) {
        positionEmptyCart.innerHTML = `<p>Votre panier est vide</p>`;
    } else {
        let prixProduits = [];
        for (let produit in produitLocalStorage) {
            fetch("https://site-kanap-back.vercel.app/api/products/" + produitLocalStorage[produit].idProduit)
                .then((res) => {
                    return res.json();
                }).then(async function (resultatAPI) {
                article = await resultatAPI;
                if (article) {
                    updateCartWithProducts(article, produit);
                    prixProduits.push(article.price);
                    Totals(prixProduits);
                    modifyQtt(prixProduits);
                    deleteProduct(prixProduits);
                }
            }).catch((error) => {
                console.error(error);
            })
        }
    }
}

ProductsCart();

/* Modification d'une quantité de produit */
function modifyQtt(prixProduits) {
    // Pointer tous les input "nb de produits" identifiés par la classe ".itemQuantity"
    let qttModif = document.querySelectorAll(".itemQuantity");

    // Créer un tableau temporaire qui est l'image fidèle de localStorage
    all_products = JSON.parse(localStorage.getItem('produit')); 

    for (let k = 0; k < qttModif.length; k++) {
        qttModif[k].addEventListener("change", (event) => {
            event.preventDefault();

            /* Selection de l'element à modifier en fonction de son id ET sa couleur */
            let quantityModif = produitLocalStorage[k].quantiteProduit;
            let qttModifValue = qttModif[k].valueAsNumber;  
            el = produitLocalStorage[k];
                
            if (el.qttModifValue != quantityModif) {
                // Modifier l'index du tableau temporaire relatif à la quantité du produit
                all_products[k].quantiteProduit = qttModifValue;

                // Mettre à jour le localStorage conformément à la valeur du tableau temporaire
                localStorage.setItem('produit', JSON.stringify(all_products))

                // Recharger la page 
                location.reload();
            }            
        })
    }
}

/* Suppression d'un produit */
function deleteProduct(prixProduits) {
    // Créer un tableau temporaire qui est l'image fidèle de localStorage
    all_products = JSON.parse(localStorage.getItem('produit')); 

    // Pointer tous les boutons "supprimer" identifiés par la classe "deleteItem"
    let btn_supprimer = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < btn_supprimer.length; j++) {
        btn_supprimer[j].addEventListener("click", (event) => {
            event.preventDefault();

            /* Selection de l'element à supprimer en fonction de son id ET sa couleur */
            let idDelete = produitLocalStorage[j].idProduit;

            if (all_products[j].idProduit == idDelete) {

                // Enlever le contenu de l'index du tableau temporaire
                all_products.splice(j,1);

                // Mettre à jour le localStorage conformément à la valeur du tableau temporaire
                localStorage.setItem('produit', JSON.stringify(all_products));

                // Recharger la page 
                location.reload();
            }
        })
    }
}

//Instauration formulaire avec regex
function getForm() {
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    });

    // Ecoute de la modification du prénom
    form.lastName.addEventListener('change', function () {
        validLastName(this);
    });

    // Ecoute de la modification du prénom
    form.address.addEventListener('change', function () {
        validAddress(this);
    });

    // Ecoute de la modification du prénom
    form.city.addEventListener('change', function () {
        validCity(this);
    });

    // Ecoute de la modification du prénom
    form.email.addEventListener('change', function () {
        validEmail(this);
    });

    //validation du prénom
    const validFirstName = function (inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (charRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    // validation du nom
    const validLastName = function (inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (charRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de l'adresse
    const validAddress = function (inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de la ville
    const validCity = function (inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (charRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de l'email
    const validEmail = function (inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
        }
    };
}

getForm();

// TODO envoie des donnés du clients au local storage à faire !
function postForm() {


    const btnCommander = document.getElementById("order");

    //Ecouter le panier
    btnCommander.addEventListener("click", (event) => {
        event.preventDefault();

        //Récupération des coordonnées du formulaire client
        const inputName = document.getElementById('firstName');
        const inputLastName = document.getElementById('lastName');
        const inputAdress = document.getElementById('address');
        const inputCity = document.getElementById('city');
        const inputMail = document.getElementById('email');


        //Construction d'un tableau depuis le local storage
        let idProducts = [];
        for (let i = 0; i < produitLocalStorage.length; i++) {
            idProducts.push(produitLocalStorage[i].idProduit);
        }


        // On crée les objets contact et produits recquis pour l'envoi vers l'API
        const order = {
            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: idProducts,
        }


        // défini les paramètres de notre requête
        const header = new Headers();
        header.append('Content-Type', 'application/json');


        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: header

        };


        let url = 'https://site-kanap-back.vercel.app/api/products/order';

        fetch(url, options).then((response) => {

            response.json().then((data) => {


                localStorage.removeItem('produit');


                document.location.href = "confirmation.html?orderId=" + data.orderId;
            })
                .catch((err) => {

                    alert("Problème avec fetch : " + err.message);
                });
        })
    })
}

postForm();