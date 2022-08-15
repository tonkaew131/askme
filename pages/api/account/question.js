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
            prisma.$disconnect();
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
        prisma.$disconnect(); // No need to wait
        return res.status(200).json({
            data: {
                questions: userDB.questions
            }
        });
    }

    // Add new question
    if (req.method == 'POST') {
        const { title } = req.query;
        if (title == undefined) {
            prisma.$disconnect(); // No need to wait
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, missing title params'
                }
            });
        }

        const isPrimary = req.query.isPrimary == 'true' ? true : false;
        const question = await prisma.question.create({
            data: {
                userId: userDB.id,
                title: title
            }
        })

        // Set user's primary question
        if (isPrimary) {
            await prisma.user.update({
                where: {
                    id: userDB.id
                }, data: {
                    primaryQuestionId: question.id
                }
            })
        }

        prisma.$disconnect(); // No need to await
        return res.status(200).json({
            data: {
                message: 'Resource updated successfully'
            }
        });
    }
});