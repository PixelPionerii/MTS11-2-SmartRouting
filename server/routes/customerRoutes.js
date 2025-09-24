const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { verifyJWT } = require('../middleware/auth');
const { getIssueType, createAgentMappingPrompt, getSuitableAgent } = require('../utils/prompts');

const router = express.Router();
const prisma = new PrismaClient();

// Route to create a new request (accessible only by authenticated customers)
router.post('/request/create', verifyJWT('customer'), async (req, res) => {
  const { description, priority } = req.body;

  if (!description || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const promptTemplates = await prisma.prompt.findMany({
    where: {
      promptId: {
        in: ['request_type', 'agent_mapping']
      }
    }
  });

  const requestTypePromptTemplate = promptTemplates.find(p => p.promptId === 'request_type').prompt;
  const requestTypePrompt = requestTypePromptTemplate.replace('{description}', description);
  const requestType = await getIssueType(requestTypePrompt);

  const customer = await prisma.customer.findUnique({
    where: { id: req.user.userId },
  });

  const agentMappingPromptTemplate = promptTemplates.find(p => p.promptId === 'agent_mapping').prompt;
  const agentMappingPrompt = await createAgentMappingPrompt(agentMappingPromptTemplate, description, priority, requestType, customer);

  const mappedAgent = await getSuitableAgent(agentMappingPrompt);

  try {
    let updatedAgent = null
    // Wrap in transaction
    await prisma.$transaction(async (prisma) => {
      const newRequest = await prisma.request.create({
        data: {
          description,
          type: requestType,
          priority,
          status: 'OPEN',
          customerId: customer.id,
          agentID: mappedAgent.assignedAgentId,
          mappingReason: mappedAgent.reason,
        },
      });

      updatedAgent = await prisma.agent.update({
        where: { id: mappedAgent.assignedAgentId },
        data: {
          currentWorkload: {
            increment: 1,
          },
        },
      });
    });
    res.status(201).json({ message: 'Request created and workload updated', assignedAgentName: updatedAgent.name });
  } catch (err) {
    console.error('Transaction failed:', err);
    res.status(500).json({ error: 'Failed to create request and update agent workload' });
  }
});

router.put('/request/close', verifyJWT('customer'), async (req, res) => {
  const { requestId, rating } = req.body; // destructure both from body

  // Validate inputs
  if (typeof requestId !== 'number' || typeof rating !== 'number') {
    return res.status(400).json({ error: 'requestId and rating are required and must be numbers' });
  }

  try {
    const request = await prisma.request.findUnique({ where: { id: requestId } });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.customerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied: Request does not belong to you' });
    }

    if (request.status !== 'OPEN') {
      return res.status(400).json({ error: 'Request is not open' });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: 'CLOSE',
          rating: rating,
        },
      });

      if (request.agentID) {
        await prisma.agent.update({
          where: { id: request.agentID },
          data: {
            totalRating: { increment: rating },
            issueResolvedCount: { increment: 1 },
            currentWorkload: { decrement: 1 },
          },
        });
      }
    });

    res.json({ message: 'Request closed successfully' });
  } catch (err) {
    console.error('Transaction failed:', err);
    res.status(500).json({ error: 'Failed to close request' });
  }
});

router.get('/request', verifyJWT('customer'), async (req, res) => {
  try {
    const allRequests = await prisma.request.findMany({
      where: {
        customerId: req.user.userId,
      },
      select: {
        id: true,
        description: true,
        status: true,
        mappingReason: true,
        priority: true,
        type: true,
        customer: {
          select: {
            id: true,
            name: true,
            phoneNo: true,
            email: true,
            language: true
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            availability: true,
            phoneNo: true,
            email: true,
            languagesKnown: true
          },
        },
      }
    });
    res.json(
      {
        openRequests: allRequests.filter(reques => reques.status == 'OPEN'),
        closedRequests: allRequests.filter(reques => reques.status == 'CLOSE')
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;