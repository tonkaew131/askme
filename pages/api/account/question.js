import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    await prisma.$connect();

    // Get list of User's questions
    if (req.method == 'GET') {
        const userDB = await prisma.User.findFirst({
            where: {
                email: user.email
            }
        });

        // User's not whitelist
        if(userDB == null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: 'Not Found'
                }
            })
        } 

        await prisma.$disconnect();
        return res.status(200).json({
            'users': userDB
        });
    }

    await prisma.$disconnect();
    return res.status(405).json({
        error: {
            code: 405,
            message: 'Method Not Allowed'
        }
    });
});