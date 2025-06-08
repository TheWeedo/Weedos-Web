
// Sample JS for rendering cart; this block gets patched
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.querySelector("#cart-table tbody");
  const totalEl = document.getElementById("cart-total");
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.name}</td><td>${item.variant}</td><td>$${item.price.toFixed(2)}</td><td>${item.quantity}</td><td>$${(item.price * item.quantity).toFixed(2)}</td><td><button onclick="removeFromCart(${index})">Remove</button></td>`;
    tbody.appendChild(tr);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}
