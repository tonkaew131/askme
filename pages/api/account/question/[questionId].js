import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import prisma from '../../../../shared/prisma';

export default withApiAuthRequired(async function handler(req, res) {
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
        const question = await prisma.question.findFirst({
            where: {
                id: userDb.primaryQuestionId
            },
            include: {
                answers: true
            }
        })

        return res.status(200).json({
            data: {
                answers: question.answers
            }
        });
    }
});