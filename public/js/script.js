fillSection();

/* je recupere les articles de l'API */
async function getArticles() {
    let articlesCatch = await fetch("http://localhost:3002/api/products")
    return await articlesCatch.json();
}

/* Distribution des données de l'API */
async function fillSection() {
    await getArticles()
        .then(function (articles) {
            console.table(articles);
            for (let article in articles) {

                /* Insertion de "a" */
                let productLink = document.createElement("a");
                document.querySelector(".items").appendChild(productLink);
                let str = "https://waytolearnx.com/t.html?name=alex-babtise&age=25&address=paris";
                let url = new URL(str);
                let search_params = new URLSearchParams(url.search);
                if (search_params.has('name')) {
                    let name = search_params.get('name');

                }
                productLink.href = `product.html?id=${articles[article]._id}`;

                /* Insertion de "article" */
                let productArticle = document.createElement("article");
                productLink.appendChild(productArticle);

                /* Insertion de l'image */
                let productImg = document.createElement("img");
                productArticle.appendChild(productImg);
                productImg.src = articles[article].imageUrl;
                productImg.alt = articles[article].altTxt;

                /* Insertion du "h3" */
                let productName = document.createElement("h3");
                productArticle.appendChild(productName);
                productName.classList.add("productName");
                productName.innerHTML = articles[article].name;

                /* Insertion de la description "p" */
                let productDescription = document.createElement("p");
                productArticle.appendChild(productDescription);
                productDescription.classList.add("productName");
                productDescription.innerHTML = articles[article].description;
            }
        })
        .catch(function (error) {
            return error;
        });
}