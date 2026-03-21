// ===== MENU DATA =====
const MENU = [
  // Starters
  { id: 1, name: 'Mushroom Bruschetta', desc: 'Grilled sourdough with wild mushroom ragù, truffle oil & fresh thyme', price: 320, category: 'starter', emoji: '🍄', veg: true },
  { id: 2, name: 'Prawn Cocktail', desc: 'Tiger prawns, house Marie Rose sauce, crispy lettuce & paprika', price: 480, category: 'starter', emoji: '🍤', veg: false },
  { id: 3, name: 'Soup du Jour', desc: 'Chef\'s daily soup with artisan bread & whipped butter', price: 250, category: 'starter', emoji: '🍲', veg: true },
  { id: 4, name: 'Burrata Salad', desc: 'Fresh burrata, heirloom tomatoes, basil oil & aged balsamic', price: 420, category: 'starter', emoji: '🥗', veg: true },

  // Mains
  { id: 5, name: 'Grilled Salmon', desc: 'Atlantic salmon, lemon butter, capers, dill mash & green beans', price: 850, category: 'main', emoji: '🐟', veg: false },
  { id: 6, name: 'Lamb Rack', desc: 'French-trimmed rack, herb crust, red wine jus & roasted root vegetables', price: 1200, category: 'main', emoji: '🍖', veg: false },
  { id: 7, name: 'Wild Mushroom Risotto', desc: 'Arborio rice, porcini, pecorino, truffle shavings & crispy sage', price: 650, category: 'main', emoji: '🍚', veg: true },
  { id: 8, name: 'Chicken Coq au Vin', desc: 'Braised chicken, lardons, pearl onions, mushrooms in red wine', price: 780, category: 'main', emoji: '🍗', veg: false },
  { id: 9, name: 'Paneer Tikka Masala', desc: 'Cottage cheese in spiced tomato-cream sauce, naan & saffron rice', price: 580, category: 'main', emoji: '🧀', veg: true },
  { id: 10, name: 'Seafood Linguine', desc: 'Prawns, squid, mussels in white wine & cherry tomato sauce', price: 920, category: 'main', emoji: '🍝', veg: false },

  // Desserts
  { id: 11, name: 'Crème Brûlée', desc: 'Classic vanilla custard with caramelised sugar & seasonal berries', price: 320, category: 'dessert', emoji: '🍮', veg: true },
  { id: 12, name: 'Chocolate Fondant', desc: 'Dark 72% chocolate, molten centre, vanilla bean ice cream', price: 380, category: 'dessert', emoji: '🍫', veg: true },
  { id: 13, name: 'Tiramisu', desc: 'House-made, espresso-soaked sponge, mascarpone cream & cocoa', price: 340, category: 'dessert', emoji: '☕', veg: true },
  { id: 14, name: 'Mango Sorbet', desc: 'Alphonso mango, lime zest, fresh mint — light & refreshing', price: 260, category: 'dessert', emoji: '🥭', veg: true },

  // Drinks
  { id: 15, name: 'House Red Wine', desc: 'Selected French Bordeaux, full-bodied with notes of dark fruit', price: 450, category: 'drinks', emoji: '🍷', veg: true },
  { id: 16, name: 'Sparkling Water', desc: 'San Pellegrino 750ml, chilled & served with lemon', price: 180, category: 'drinks', emoji: '💧', veg: true },
  { id: 17, name: 'Artisan Lemonade', desc: 'House-pressed, elderflower, fresh mint & crushed ice', price: 220, category: 'drinks', emoji: '🍋', veg: true },
  { id: 18, name: 'Espresso Martini', desc: 'Vodka, espresso, coffee liqueur — shaken hard', price: 520, category: 'drinks', emoji: '🍸', veg: true },
];

// ===== STATE =====
let cart = {};
let guestName = '';
let tableNumber = '';
let guestConfirmed = false;
let activeFilter = 'all';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(MENU);
});

// ===== GUEST =====
function confirmGuest() {
  const name = document.getElementById('guestName').value.trim();
  const table = document.getElementById('tableNumber').value.trim();

  if (!name) { showStatus('Please enter your name.', 'error'); return; }
  if (!table || table < 1 || table > 50) { showStatus('Please enter a valid table number (1-50).', 'error'); return; }

  guestName = name;
  tableNumber = table;
  guestConfirmed = true;

  showStatus(`Welcome, ${name}! You're at Table ${table}. Enjoy browsing the menu below.`);
  updateCartGuestInfo();

  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function showStatus(msg, type) {
  const el = document.getElementById('guestStatus');
  el.textContent = msg;
  el.style.color = type === 'error' ? '#e74c3c' : '#b8902a';
}

function updateCartGuestInfo() {
  const el = document.getElementById('cartGuestInfo');
  if (guestConfirmed) {
    el.innerHTML = `<span>👤 ${guestName} &nbsp;·&nbsp; Table ${tableNumber}</span>`;
    el.classList.add('filled');
  } else {
    el.innerHTML = `<span>Please fill in your name & table first</span>`;
    el.classList.remove('filled');
  }
}

// ===== MENU RENDER =====
function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="card-emoji">${item.emoji}</div>
      <div class="card-body">
        <div class="card-category">${item.veg ? '<span class="veg-badge"></span>' : ''}${item.category}</div>
        <h3 class="card-name">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="card-add" id="addBtn-${item.id}" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  // Update button states for existing cart
  Object.keys(cart).forEach(id => {
    const btn = document.getElementById(`addBtn-${id}`);
    if (btn && cart[id] > 0) btn.classList.add('added');
  });
}

function filterMenu(cat, el) {
  activeFilter = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat === 'all' ? MENU : MENU.filter(m => m.category === cat);
  renderMenu(filtered);
}

// ===== CART =====
function addToCart(id) {
  if (!guestConfirmed) {
    document.getElementById('order-section').scrollIntoView({ behavior: 'smooth' });
    showStatus('Please enter your name & table number first!', 'error');
    return;
  }
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();

  const btn = document.getElementById(`addBtn-${id}`);
  if (btn) {
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '+ Add';
    }, 1500);
  }
}

function updateCartUI() {
  const items = Object.entries(cart);
  const total = items.reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id == id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const count = items.reduce((sum, [, qty]) => sum + qty, 0);
  document.getElementById('cartCount').textContent = count;

  const cartItemsEl = document.getElementById('cartItems');
  if (items.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    document.getElementById('cartFooter').style.display = 'none';
  } else {
    cartItemsEl.innerHTML = items.map(([id, qty]) => {
      const item = MENU.find(m => m.id == id);
      if (!item) return '';
      return `
        <div class="cart-item">
          <span style="font-size:1.5rem">${item.emoji}</span>
          <span class="cart-item-name">${item.name}</span>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
          </div>
          <span class="cart-item-price">₹${item.price * qty}</span>
        </div>
      `;
    }).join('');
    document.getElementById('cartFooter').style.display = 'block';
    document.getElementById('cartTotal').textContent = `₹${total}`;
  }
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ===== PLACE ORDER =====
async function placeOrder() {
  if (!guestConfirmed) { alert('Please set your name & table first.'); return; }
  if (Object.keys(cart).length === 0) { alert('Your cart is empty!'); return; }

  const items = Object.entries(cart).map(([id, qty]) => {
    const item = MENU.find(m => m.id == id);
    return { id: Number(id), name: item.name, qty, price: item.price, subtotal: item.price * qty };
  });

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const note = document.getElementById('orderNote').value.trim();

  const order = {
    guestName,
    tableNumber: Number(tableNumber),
    items,
    total,
    note,
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (!res.ok) throw new Error('Server error');

    // Success
    cart = {};
    updateCartUI();
    toggleCart();
    document.getElementById('modalText').textContent =
      `Thank you, ${guestName}! Your order for Table ${tableNumber} has been sent to the kitchen.`;
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('orderNote').value = '';

  } catch (err) {
    alert('Could not place order. Please try again or call a waiter.');
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
