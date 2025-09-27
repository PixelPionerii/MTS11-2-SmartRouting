const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { verifyJWT } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/request', verifyJWT('admin'), async (req, res) => {
    try {
        const allRequests = await prisma.request.findMany({
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

router.put('/request/close', verifyJWT('admin'), async (req, res) => {
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

router.get('/getAvailability', verifyJWT('admin'), async (req, res) => {
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

router.put('/setAvailability', verifyJWT('admin'), async (req, res) => {
    const { availability } = req.body; // destructure both from body
    try {
        const agent = await prisma.agent.update({
            where: { id: req.user.userId },
            data: {
                availability: availability
            },
        });
        res.json({ message: "agent availability status updated", status: agent.availability })
    } catch (error) {
        console.error('failed:', err);
        res.status(500).json({ error: 'Failed to update agent availability status' });
    }
})

router.get('/getAgents', verifyJWT('admin'), async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({
            where: {
                isAdmin: false
            },
            select: {
                id: true,
                name: true,
                availability: true,
                phoneNo: true,
                email: true,
                languagesKnown: true,
                currentWorkload: true,
                issueResolvedCount: true,
                totalRating: true,
                skills: true
            }
        });
        res.json(agents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});

router.post('/addAgent', verifyJWT('admin'), async (req, res) => {
    try {
        const { name, email, languagesKnown, password, skills, isAdmin, phoneNo } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAgent = await prisma.agent.create({
            data: {
                name,
                email,
                languagesKnown,
                password: hashedPassword,
                skills,
                isAdmin,
                phoneNo,
                availability: true,
                currentWorkload: 0,
                issueResolvedCount: 0,
                totalRating: 0.0
            }
        });
        res.status(201).json({ message: "Agent added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add agent' });
    }
});

router.get('/getAgent/:id', verifyJWT('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const agentId = parseInt(id);
        if (isNaN(agentId)) {
            return res.status(400).json({ error: 'Invalid agent ID' });
        }


        const agent = await prisma.agent.findUnique({
            where: {
                id: agentId
            },
            select: {
                id: true,
                name: true,
                email: true,
                languagesKnown: true,
                skills: true,
                isAdmin: true,
                phoneNo: true
            }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.status(201).json({ agent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get agent' });
    }
});

router.put('/updateAgent', verifyJWT('admin'), async (req, res) => {
    try {
        const { id, name, email, languagesKnown, skills, isAdmin, phoneNo } = req.body;

        const agentId = parseInt(id);
        if (isNaN(agentId)) {
            return res.status(400).json({ error: 'Invalid agent ID' });
        }

        const updateData = {};
        updateData.name = name;
        updateData.email = email;
        updateData.languagesKnown = languagesKnown;
        updateData.skills = skills;
        updateData.isAdmin = isAdmin;
        updateData.phoneNo = phoneNo;

        const updatedAgent = await prisma.agent.update({
            where: { id: agentId },
            data: updateData
        });

        res.status(200).json({ message: 'Agent updated successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Agent not found' });
        }
        res.status(500).json({ error: 'Failed to update agent' });
    }
});

router.get('/getPrompts', verifyJWT('admin'), async (req, res) => {
    try {
        const prompts = await prisma.prompt.findMany();

        res.status(201).json({ prompts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get agent' });
    }
});

router.put('/updatePrompt', verifyJWT('admin'), async (req, res) => {
    const { promptId, prompt } = req.body;

    try {
        const prompts = await prisma.prompt.update({
            where: {
                promptId: promptId
            },
            data: {
                prompt
            }
        });

        res.status(201).json({ message: promptId + ' updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update prompt' });
    }
});


module.exports = router;