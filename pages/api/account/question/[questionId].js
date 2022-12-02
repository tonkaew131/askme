import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import prisma from '../../../../shared/prisma';

export default withApiAuthRequired(async function handler(req, res) {
    const { questionId } = req.query;
    const { user } = getSession(req, res);
    let userDb = null;

    // Check if user's whitelist
    if (req.method == 'GET') {
        userDb = await prisma.user.findFirst({
            where: {
                email: user.email
            }
        });

        // User's not whitelist
        if (userDb == null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: 'Not Found'
                }
            });
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
        let question;
        try {
            question = await prisma.question.findFirst({
                where: {
                    id: questionId
                },
                include: {
                    answers: true
                }
            });
        } catch (error) {
            if(error.message.includes('Inconsistent column data: Malformed ObjectID')) {
                return res.status(404).json({
                    error: {
                        code: 404,
                        message: 'Not Found'
                    }
                })
            }

            return res.status(500).json({
                error: {
                    code: 500,
                    message: 'Internal Server Error'
                }
            })
        }

        return res.status(200).json({
            data: question
        });
    }
});