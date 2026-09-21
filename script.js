const cart = JSON.parse(localStorage.getItem('ayush-cart') || '[]');
const cartDrawer = document.querySelector('.cart-drawer');
const cartOverlay = document.querySelector('.cart-overlay');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total strong span');
const toast = document.querySelector('.toast');

function formatPrice(value) {
  return `$${value}`;
}

function updateCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = cart.reduce((total, item) => total + item.price, 0);
  localStorage.setItem('ayush-cart', JSON.stringify(cart));

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your loadout is empty.<br /><span>Find something worth equipping.</span></p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div><h3>${item.name}</h3><p>Quantity 1</p></div>
      <div><strong>${formatPrice(item.price)}</strong><button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}">×</button></div>
    </div>
  `).join('');

  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      updateCart();
    });
  });
}

function toggleCart(open) {
  cartDrawer.classList.toggle('open', open);
  cartOverlay.classList.toggle('open', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('cart-open', open);
}

document.querySelector('.cart-button').addEventListener('click', () => toggleCart(true));
document.querySelector('.close-cart').addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    cart.push({
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
    });
    updateCart();
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelector('.filter-tab.active').classList.remove('active');
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    applyProductFilters(filter, document.querySelector('#product-search').value);
  });
});

function applyProductFilters(filter, query) {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll('.product-card').forEach((card, index) => {
    const searchableText = `${card.dataset.name} ${card.dataset.category} ${card.querySelector('.product-info p').textContent}`.toLowerCase();
    const matchesFilter = filter === 'all' || card.dataset.category === filter;
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
    const visible = matchesFilter && matchesSearch;
    card.classList.toggle('hidden', !visible);
    if (visible) {
      visibleCount += 1;
      card.style.animationDelay = `${index * 60}ms`;
    }
  });
  document.querySelector('.item-count').textContent = `${String(visibleCount).padStart(2, '0')} items`;
  document.querySelector('.search-status').textContent = normalizedQuery ? `${visibleCount} matching items` : '09 items ready to equip';
}

const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('#product-search');
document.querySelector('.search-toggle').addEventListener('click', () => {
  const isOpen = searchPanel.classList.toggle('open');
  searchPanel.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) window.setTimeout(() => searchInput.focus(), 100);
});
searchInput.addEventListener('input', () => {
  const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
  applyProductFilters(activeFilter, searchInput.value);
});
document.querySelector('.search-clear').addEventListener('click', () => {
  searchInput.value = '';
  applyProductFilters(document.querySelector('.filter-tab.active').dataset.filter, '');
  searchInput.focus();
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.main-nav').classList.toggle('open');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => document.querySelector('.main-nav').classList.remove('open'));
});

document.querySelector('.checkout-button').addEventListener('click', () => {
  if (!cart.length) {
    toast.textContent = 'Your loadout is empty';
  } else {
    window.location.href = 'buy.html';
  }
  toast.classList.add('show');
  window.setTimeout(() => {
    toast.classList.remove('show');
    toast.innerHTML = 'Added to your loadout <span>✓</span>';
  }, 1800);
});

updateCart();
