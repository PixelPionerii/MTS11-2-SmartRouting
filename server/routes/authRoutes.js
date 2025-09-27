// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const router = express.Router();

const JWT_SECRET = 'ASas12.,';

// Customer sign-up
router.post('/customer/signup', async (req, res) => {
  const { name, email, password, language, tier, phoneNo } = req.body;
  try {
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (existingCustomer) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        language,
        tier,
        phoneNo
      },
    });

    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Customer login
router.post('/customer/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: customer.id, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: 'customer', name: customer.name });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Agent login
router.post('/agent/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const agent = await prisma.agent.findUnique({ where: { email } });
    if (!agent) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, agent.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Determine role based on isAdmin
    const role = agent.isAdmin ? 'admin' : 'agent';

    // Sign JWT with role info
    const token = jwt.sign(
      { userId: agent.id, role: role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role, name: agent.name });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;