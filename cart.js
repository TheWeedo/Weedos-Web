
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

function addToCart(productName, variant, price) {
  const cart = getCart();
  const existing = cart.find(item => item.name === productName && item.variant === variant);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, variant: variant, price: price, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(`${productName} / ${variant} added to cart.`);
}

function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.variant}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button data-index="${index}" class="remove-btn">X</button></td>
    `;
    tbody.appendChild(row);
  });
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      removeFromCart(idx);
    });
  });
  updateCartCount();
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  // Handle Add to Cart button on product pages
  const addBtn = document.querySelector('.add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const productNameElem = document.querySelector('.product h3');
      const productName = productNameElem ? productNameElem.innerText : 'Item';
      const select = document.querySelector('.product select');
      const variantText = select.options[select.selectedIndex].text;
      const priceMatch = variantText.match(/\$(\d+(?:\.\d+)?)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      addToCart(productName, variantText, price);
    });
  }
  // If on cart page
  if (document.getElementById('cart-table')) {
    renderCart();
  }
});
