const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'orders.json');

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ===== HELPERS =====
function loadOrders() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
}

// ===== API ROUTES =====

// GET all orders
app.get('/api/orders', (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

// POST new order
app.post('/api/orders', (req, res) => {
  const { guestName, tableNumber, items, total, note, timestamp } = req.body;

  if (!guestName || !tableNumber || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order = {
    id: uuidv4(),
    guestName,
    tableNumber,
    items,
    total,
    note: note || '',
    status: 'pending',
    timestamp: timestamp || new Date().toISOString()
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  console.log(`\n🍽️  New Order #${order.id.slice(0, 6)} from ${guestName} at Table ${tableNumber}`);
  console.log(`   Items: ${items.map(i => `${i.name} x${i.qty}`).join(', ')}`);
  console.log(`   Total: ₹${total}`);
  if (note) console.log(`   Note: ${note}`);

  res.status(201).json({ success: true, orderId: order.id });
});

// PATCH order status
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'preparing', 'ready'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = loadOrders();
  const order = orders.find(o => o.id === id);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  saveOrders(orders);

  console.log(`✅  Order ${id.slice(0, 6)} — Status updated to: ${status.toUpperCase()}`);
  res.json({ success: true, status });
});

// DELETE all orders (for testing/reset)
app.delete('/api/orders', (req, res) => {
  saveOrders([]);
  res.json({ success: true, message: 'All orders cleared' });
});

// ===== CATCH-ALL (SPA) =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n🌹 La Maison Rouge Server Running`);
  console.log(`   Guest Menu:     http://localhost:${PORT}`);
  console.log(`   Kitchen View:   http://localhost:${PORT}/kitchen.html`);
  console.log(`   API:            http://localhost:${PORT}/api/orders\n`);
});
