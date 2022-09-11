import prisma from '../../../shared/prisma';

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { accountId } = req.query;

    const user = await prisma.user.findFirst({
        where: {
            instagramId: accountId
        }
    });

    // If user doesn't exist
    if (user == null) {
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    // If user doesn't have primary question
    if (user.primaryQuestionId == '') {
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    const question = await prisma.question.findFirst({
        where: {
            id: user.primaryQuestionId
        }
    });

    // Error in system???
    if (question == null) {
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    // If question is removed, primary question will automatically removed too
    if (question.isDeleted == true) {
        await prisma.user.update({
            where: {
                id: user.id
            }, data: {
                primaryQuestionId: ''
            }
        })

        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    delete question['isDeleted']; // pointless, but cool

    // Get Question
    if (req.method == 'GET') {
        return res.status(200).json({
            data: question
        });
    }

    // Post Answer to Question
    if (req.method == 'POST') {
        // Header ip, and ua
        console.log(req.headers['host']);
        console.log(req.headers['user-agent']);

        const { text } = req.query;
        if (text == undefined) {
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, missing text'
                }
            });
        }

        await prisma.answer.create({
            data: {
                questionId: question.id,
                text: text
            }
        });

        return res.status(200).json({
            data: {
                message: 'Resource updated successfully'
            }
        });
    }

    return res.status(405).json({
        error: {
            code: 405,
            message: 'Method Not Allowed'
        }
    });
}