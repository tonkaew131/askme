import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { accountID } = req.query;

    await prisma.$connect();
    const user = await prisma.user.findFirst({
        where: {
            instagramId: accountID
        }
    });

    // If user doesn't exist
    if (user == null) {
        prisma.$disconnect(); // No need to wait
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    // If user doesn't have primary question
    if (user.primaryQuestionId == '') {
        prisma.$disconnect(); // No need to wait
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
        prisma.$disconnect(); // No need to wait
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

        prisma.$disconnect(); // No need to wait
        return res.status(404).json({
            error: {
                code: 404,
                message: 'Not Found'
            }
        });
    }

    delete question['isDeleted']; // pointless, but cool
    prisma.$disconnect(); // No need to wait

    res.status(200).json({
        data: question
    });
}