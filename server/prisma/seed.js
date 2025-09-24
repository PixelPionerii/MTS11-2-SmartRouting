const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
    // Insert prompts
    await prisma.prompt.createMany({
        data: [
            {
                promptId: 'request_type',
                prompt: 'Enter the type of request you need assistance with.',
            },
            {
                promptId: 'agent_mapping',
                prompt: 'Map the user query to the appropriate agent skill.',
            },
        ],
    });
    console.log('Prompts seeded.');

    // Insert an admin agent
    await prisma.agent.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: '$2b$10$8Bytgrb6tvj.2dzZSyDWf.hC6GNg74Z7TU6uan.Chqa.ztofavsVC', // admin@123
            languagesKnown: ['English'], // example languages
            availability: true,
            skills: ['Management', 'Support'], // example skills
            isAdmin: true,
            currentWorkload: 0,
            phoneNo: '1234567890',
            issueResolvedCount: 0,
            totalRating: 0.0,
        },
    });
    console.log('Admin agent created.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });