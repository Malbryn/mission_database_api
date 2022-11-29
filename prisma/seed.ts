import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.upsert({
        where: { username: 'malbryn' },
        update: {},
        create: {
            username: 'malbryn',
            password: process.env.USER_PASSWORD ?? '',
        },
    });

    console.log('Database seeding is done');
    console.log('Created admin user: ', admin.username);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
