let cart = [];

const vegBtn = document.getElementById("vegBtn");
const nonVegBtn = document.getElementById("nonVegBtn");
const allBtn = document.getElementById("allBtn");
const items = document.querySelectorAll(".item");

vegBtn.onclick = () => {
  items.forEach(item => {
    item.style.display = item.classList.contains("veg") ? "block" : "none";
  });
};

nonVegBtn.onclick = () => {
  items.forEach(item => {
    item.style.display = item.classList.contains("nonveg") ? "block" : "none";
  });
};

allBtn.onclick = () => {
  items.forEach(item => {
    item.style.display = "block";
  });
};
function viewItem(name, price, desc) {
  const cartSection = document.getElementById("cart");

  cartSection.innerHTML = `
    <h2>Selected Item</h2>
    <h3>${name}</h3>
    <p>${desc}</p>
    <p><strong>₹${price}</strong></p>
    <button onclick="addToCart('${name}', ${price})">Add to Cart</button>
  `;
}

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const cartSection = document.getElementById("cart");

  if (cart.length === 0) {
    cartSection.innerHTML = "<h2>Cart</h2><p>No items added.</p>";
    return;
  }

  let total = 0;
  let html = "<h2>Cart</h2><ul>";

  cart.forEach(item => {
    total += item.price;
    html += `<li>${item.name} - ₹${item.price}</li>`;
  });

  html += `</ul><p><strong>Total: ₹${total}</strong></p>`;

  cartSection.innerHTML = html;
}
