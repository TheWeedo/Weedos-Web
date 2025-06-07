
function getCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  return cart ? cart : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElems = document.querySelectorAll('#cart-count');
  countElems.forEach(el => {
    el.textContent = count;
  });
}

function addToCart(productName, variant, price, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.name === productName && item.variant === variant);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name: productName, variant: variant, price: price, quantity: quantity });
  }
  saveCart(cart);
  updateCartCount();
  alert(`${quantity} × ${productName} / ${variant} added to cart.`);
}

function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.variant}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td><button onclick="removeFromCart(${index})">Remove</button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

// Hook into buttons
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const product = button.closest('.product');
      const productName = product.querySelector('h3').textContent;
      const variantSelect = product.querySelector('select');
      const variant = variantSelect ? variantSelect.value : 'Standard';
      const price = parseFloat(variantSelect.options[variantSelect.selectedIndex].textContent.match(/\$([\d.]+)/)[1]);
      const qtyInput = product.querySelector('input[type="number"]');
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

      addToCart(productName, variant, price, quantity);
    });
  });
});
