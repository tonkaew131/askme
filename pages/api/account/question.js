import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    let userDB = null;

    // Check if user's whitelist
    if (req.method == 'GET' || req.method == 'POST') {
        await prisma.$connect();

        userDB = await prisma.User.findFirst({
            where: {
                email: user.email
            },
            include: {
                questions: true
            }
        });

        // User's not whitelist
        if (userDB == null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: 'Not Found'
                }
            })
        }
    } else {
        return res.status(405).json({
            error: {
                code: 405,
                message: 'Method Not Allowed'
            }
        });
    }


    // Get list of User's questions
    if (req.method == 'GET') {
        await prisma.$disconnect();
        return res.status(200).json({
            data: {
                questions: userDB.questions
            }
        });
    }

    // Add new question
    if (req.method == 'POST') {
        const { title } = req.query;
        if(title == undefined) {
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, missing title params'
                }
            });
        }


        await prisma.question.create({
            data: {
                userId: userDB.id,
                title: title
            }
        })

        await prisma.$disconnect();
        return res.status(200).json({
            data: {
                message: 'Successfully'
            }
        });
    }
});