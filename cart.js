
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productDiv = btn.closest(".product");
      const name = productDiv.querySelector("h3").textContent.trim();
      const select = productDiv.querySelector("select");
      const variant = select ? select.value : "";
      const quantityInput = productDiv.querySelector("input[type='number']");
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

      // Extract price from the selected option text
      let price = 0;
      if (select) {
        const text = select.options[select.selectedIndex].textContent;
        const match = text.match(/\$(\d+(\.\d+)?)/);
        if (match) price = parseFloat(match[1]);
      }

      const item = { name, variant, price, quantity };

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();
      alert(name + " added to cart!");
    });
  });
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
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
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.variant}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button onclick="removeFromCart(${index})">Remove</button></td>
    `;
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
