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

    await prisma.agent.createMany({
        data: [
            {
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
                languagesKnown: ["English", "Hindi"],
                password: "password123", // you should hash passwords in production
                availability: true,
                skills: ["Billing", "Customer Support"],
                isAdmin: false,
                currentWorkload: 2,
                phoneNo: "123-456-7890",
                issueResolvedCount: 10,
                totalRating: 4.5,
            },
            {
                name: "Bob Smith",
                email: "bob.smith@example.com",
                languagesKnown: ["English"],
                password: "password456",
                availability: false,
                skills: ["Technical Support"],
                isAdmin: false,
                currentWorkload: 5,
                phoneNo: "987-654-3210",
                issueResolvedCount: 20,
                totalRating: 4.8,
            },
            {
                name: "Charlie Admin",
                email: "charlie.admin@example.com",
                languagesKnown: ["English"],
                password: "adminpass",
                availability: true,
                skills: ["Admin Management"],
                isAdmin: true,
                currentWorkload: 0,
                phoneNo: "555-555-5555",
                issueResolvedCount: 50,
                totalRating: 5.0,
            }
        ],
    });

    console.log('Sample agents have been added.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });