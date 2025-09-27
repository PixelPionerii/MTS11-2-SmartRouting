const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { verifyJWT } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/request', verifyJWT('agent'), async (req, res) => {
    try {
        const allRequests = await prisma.request.findMany({
            where: {
                agentID: req.user.userId,
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

router.put('/request/close', verifyJWT('agent'), async (req, res) => {
    const { requestId } = req.body; // destructure both from body

    // Validate inputs
    if (typeof requestId !== 'number') {
        return res.status(400).json({ error: 'requestId is required and must be numbers' });
    }

    try {
        const request = await prisma.request.findUnique({ where: { id: requestId } });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.agentID !== req.user.userId) {
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
                    rating: 0
                },
            });

            if (request.agentID) {
                await prisma.agent.update({
                    where: { id: request.agentID },
                    data: {
                        issueResolvedCount: { increment: 1 },
                        currentWorkload: { decrement: 1 }
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

router.get('/getAvailability', verifyJWT('agent'), async (req, res) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { id: req.user.userId }
        });
        res.json({status: agent.availability})
    } catch (error) {
        console.error('failed:', err);
        res.status(500).json({ error: 'Failed to get agent availability status' });
    }
})


router.put('/setAvailability', verifyJWT('agent'), async (req, res) => {
    const { availability } = req.body; // destructure both from body
    try {
        const agent = await prisma.agent.update({
            where: { id: req.user.userId },
            data: {
                availability: availability
            },
        });
        res.json({message: "agent availability status updated", status: agent.availability})
    } catch (error) {
        console.error('failed:', error);
        res.status(500).json({ error: 'Failed to update agent availability status' });
    }
})

module.exports = router;