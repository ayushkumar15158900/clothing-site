const cart = JSON.parse(localStorage.getItem('ayush-cart') || '[]');
const summaryItems = document.querySelector('#summary-items');
const subtotal = document.querySelector('#summary-subtotal');
const total = document.querySelector('#summary-total');

function renderSummary() {
  const amount = cart.reduce((sum, item) => sum + item.price, 0);
  subtotal.textContent = `$${amount}`;
  total.textContent = `$${amount}`;

  if (!cart.length) {
    summaryItems.innerHTML = '<p class="summary-empty">Your loadout is empty.<br /><a href="index.html#shop">Return to the drop →</a></p>';
    document.querySelector('.place-order').disabled = true;
    return;
  }

  summaryItems.innerHTML = cart.map((item) => `
    <div class="summary-item"><img src="${item.image}" alt="${item.name}" /><div><h3>${item.name}</h3><p>Quantity 1</p></div><strong>$${item.price}</strong></div>
  `).join('');
}

document.querySelector('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!cart.length) return;
  localStorage.removeItem('ayush-cart');
  document.querySelector('.buy-intro').hidden = true;
  document.querySelector('.buy-layout').hidden = true;
  document.querySelector('.order-success').classList.add('show');
  document.querySelector('.order-success').setAttribute('aria-hidden', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderSummary();
