import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient();

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    //await prisma.$connect();
    // const User = await prisma.user.create({
    //     data: {
    //         email: 'mokmaard646@gmail.com',
    //         instagramId: 'maardmok',
    //         primaryQuestionId: ''
    //     }
    // })

    return res.status(501).json({
        error: {
            code: 501,
            message: 'Not Implemented'
        }
    });
});