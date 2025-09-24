const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { verifyJWT } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Route to create a new request (accessible only by authenticated customers)
router.post('/request/create', verifyJWT('customer'), async (req, res) => {
  const { description, priority } = req.body;

  if (!description || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newRequest = await prisma.request.create({
      data: {
        description,
        type: '',
        priority,
        status: 'OPEN', // default status
        customerId: req.user.userId, // get customer ID from token
      },
    });
    res.status(201).json({ message: 'Request created', request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

router.put('/request/close', verifyJWT('customer'), async (req, res) => {
  const { requestId, rating } = req.body; // destructure both from body

  // Validate inputs
  if (typeof requestId !== 'number' || typeof rating !== 'number') {
    return res.status(400).json({ error: 'requestId and rating are required and must be numbers' });
  }

  try {
    // Fetch the request
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.customerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied: Request does not belong to you' });
    }

    if (request.status !== 'OPEN') {
      return res.status(400).json({ error: 'Request is not open' });
    }

    // Update request status and rating
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'CLOSE',
        rating: rating,
      },
    });

    // Update agent stats if assigned
    if (request.agentID) {
      await prisma.agent.update({
        where: { id: request.agentID },
        data: {
          totalRating: { increment: rating },
          issueResolvedCount: { increment: 1 },
        },
      });
    }

    res.json({ message: 'Request closed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close request' });
  }
});

router.get('/request', verifyJWT('customer'), async (req, res) => {
  try {
    const allRequests = await prisma.request.findMany({
      where: {
        customerId: req.user.userId,
      },
      include: { customer: true, agent: true },
    });
    res.json({ requests: allRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;