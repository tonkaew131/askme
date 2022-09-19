import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import prisma from '../../../shared/prisma';

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    let userDB = null;

    // Check if user's whitelist
    if (req.method == 'GET' || req.method == 'POST') {
        userDB = await prisma.user.findFirst({
            where: {
                email: user.email
            },
            include: {
                questions: {
                    include: {
                        _count: {
                            select: { answers: true }
                        }
                    }
                }
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
        return res.status(200).json({
            data: {
                questions: userDB.questions
            }
        });
    }

    // Add new question
    if (req.method == 'POST') {
        const { title } = req.query;
        if (title == undefined || title == '') {
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
            });
        }

        return res.status(200).json({
            data: {
                message: 'Resource updated successfully'
            }
        });
    }
});