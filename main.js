//from html
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

//! APİ OPERATİONS
//html load moment
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

//for all request
const baseUrl = "https://api.escuelajs.co/api/v1";

/* get category data
----
1- request to api
2-process incoming data
3-run the function that will process the incoming data as a card
4-if it will be error , notify the users
*/

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    //if it positive this work
    .then((res) => res.json())
    //conver data json format . it will work
    .then((data) => renderCategories(data.slice(1, 5)))
    //this works if there is an error
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  // create a card for every object
  categories.forEach((category) => {
    //create div
    const categoryDiv = document.createElement("div");
    //add class to div
    categoryDiv.classList.add("category-card");
    //determine the content of div
    categoryDiv.innerHTML = `
    <img src=${category.image} />
    <p>${category.name}</p>
    `;
    //add element to categories in html
    categoryList.appendChild(categoryDiv);
  });
}

//request for products
async function fetchProducts() {
  try {
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
  } catch (err) {
    console.log(err);
  }
}

// list the product on screen
function renderProducts(products) {
  // create card html for every product and add the array
  const productsHTML = products
    .map(
      (product) => `
          <div class="card">
            <img src=${product.images[0]} />
            <h4>${product.title}</h4>
            <h4>${product.category.name ? product.category.name : "Others"}</h4>
            <div class="action"> 
            <span>${product.price} $</span><button onClick="addToBasket({
                id:${product.id},title:'${product.title}', price:${
        product.price
      },img:'${product.images[0]}',amount:1})">Add to Cart</button>
            </div>
          </div>
  `
    )
    //Converts array data , makes a string by deleting commas
    .join(" ");

  // product HTML send the list
  productsArea.innerHTML = productsHTML;
}
// cart variables
let basket = [];
let total = 0;
//! modal operations

basketBtn.addEventListener("click", () => {
  //open cart
  modal.classList.add("active");
  //list product on cart
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

//! Cart Operations

//add to cart 'basket'
function addToBasket(product) {
  const found = basket.find((i) => i.id === product.id);
  if (found) {
    found.amount++;
  } else {
    basket.push(product);
  }
}

//list the element on cart
function renderBasket() {
  //create cart card
  const cardsHTML = basket
    .map(
      (product) =>
        `
          <div class="item">
            <img src=${product.img} />
            <h3 class="title">${product.title}</h3>
            <h4 class="price">${product.price} $</h4>
            <p>Quantity: ${product.amount}</p>
            <img onClick="deleteItem(${product.id})" id="delete" src="images/e-trash.png" />
          </div>
    `
    )
    .join(" ");

  //send html
  basketList.innerHTML = cardsHTML;

  //calculate total cart
  calculateTotal();
}

// total of cart
function calculateTotal() {
  //calculate total
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  //product quantity
  const amount = basket.reduce((tot, i) => tot + i.amount, 0);

  //sende to html
  totalCount.innerText = amount + " " + "product";
  //send total value to html
  totalSpan.innerHTML = sum;
}

// delete product from cart
function deleteItem(deleteid) {
  basket = basket.filter((i) => i.id !== deleteid);

  //update list
  renderBasket();

  //update total
  calculateTotal();
}
