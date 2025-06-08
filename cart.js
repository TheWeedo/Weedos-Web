
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  // Attach event listeners to all Add to Cart buttons
  document.querySelectorAll(".product").forEach(product => {
    const button = product.querySelector(".add-to-cart-btn");
    if (button) {
      button.addEventListener("click", () => {
        const name = product.querySelector("h3").textContent.trim();
        const select = product.querySelector("select");
        const variant = select ? select.value : "";
        const quantityInput = product.querySelector("input[type='number']");
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
        const priceText = select ? select.options[select.selectedIndex].textContent : "$0";
        const priceMatch = priceText.match(/\$([\d.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        const item = { name, variant, price, quantity };

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
      });
    }
  });
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.querySelector("#cart-table tbody");
  const totalEl = document.getElementById("cart-total");
  if (!tbody || !totalEl) return;
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

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}
