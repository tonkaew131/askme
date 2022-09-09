import { PrismaClient } from '@prisma/client'

import prisma from '../../../shared/prisma';

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

    res.status(200).json({
        data: question
    });
}