let str = window.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");
let article = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

getArticle();

// Récupération des articles de l'API
function getArticle() {
    fetch("https://site-kanap-back.vercel.app/public/html/api/products/" + idProduct)
        .then((res) => {
            return res.json();
        })

        // Répartition des données de l'API dans le DOM
        .then(async function (resultatAPI) {
            article = await resultatAPI;
            console.table(article);
            if (article) {
                getPost(article);
            }
        })
        .catch((error) => {
            console.error(error);
        })
}

function getPost(article) {
    // Insertion de l'image
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Modification du titre "h1"
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;
    let name2 = document.getElementsByTagName('title')[0];
    name2.innerHTML = article.name;

    // Modification du prix
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Modification de la description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Insertion des options de couleurs
    for (let colors of article.colors) {
        console.table(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
    addToCart(article);
}

//Gestion du panier
function addToCart(article) {
    const btn_envoyerPanier = document.querySelector("#addToCart");

    //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", (event) => {
        if (quantityPicked.value > 0 && quantityPicked.value <= 100 && quantityPicked.value != 0) {

            //Recupération du choix de la couleur
            let choixCouleur = colorPicked.value;

            //Recupération du choix de la quantité
            let choixQuantite = quantityPicked.value;


            //Récupération des options de l'article à ajouter au panier
            let optionsProduit = {
                idProduit: idProduct,
                couleurProduit: choixCouleur,
                quantiteProduit: parseInt(choixQuantite),
                nomProduit: article.name,
                descriptionProduit: article.description,
                imgProduit: article.imageUrl,
                altImgProduit: article.altTxt
            };

            //Initialisation du local storage
            let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));

            //fenêtre pop-up
            //   const popupConfirmation = () => {
            //  if (window.confirm(`Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier
            //Pour consulter votre panier, cliquez sur OK`)) {
            // window.location.href = "cart.html";
            //   }
            //   }


            // ajout produit local storage 
            // const ajoutProduitLocalStorage = (produitAajouter) => {
            /*  produitLocalStorage.push(produitAajouter);
              localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
          }; */

            //Importation dans le local storage
            //Si le panier comporte déjà au moins 1 article
            if (produitLocalStorage) {
                let resultsHaveBeenUpdated = false;
                const updatedResult = produitLocalStorage.map((el) => {
                    if (el && el.nomProduit === article.name && el.couleurProduit === choixCouleur) {
                        el.quantiteProduit = el.quantiteProduit + optionsProduit.quantiteProduit;
                        resultsHaveBeenUpdated = true;
                    }
                    return el
                });

                if (!resultsHaveBeenUpdated) {
                    updatedResult.push(optionsProduit);
                }

                localStorage.setItem("produit", JSON.stringify(updatedResult));
            } else {
                produitLocalStorage = [];
                produitLocalStorage.push(optionsProduit);
                localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
                console.table(produitLocalStorage);
            }
        }
    });
}

