import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'

import { emailValidator } from './../../../shared/utils';

const prisma = new PrismaClient();

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    let userDB = null;

    // Check if user's admin
    if (req.method == 'GET' || req.method == 'POST') {
        await prisma.$connect();

        userDB = await prisma.user.findFirst({
            where: {
                email: user.email
            }
        });

        // Check if User do not exist
        if (userDB == null) {
            prisma.$disconnect();
            return res.status(404).json({
                error: {
                    code: 404,
                    message: 'Not Found'
                }
            });
        }

        // Check if User is ADMIN
        if (userDB.role != 'ADMIN') {
            prisma.$disconnect();
            return res.status(401).json({
                error: {
                    code: 401,
                    message: 'Unauthorized'
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

    // Get all users
    if (req.method == 'GET') {
        let users = await prisma.user.findMany();
        let userCount = await prisma.user.count();

        prisma.$disconnect();
        return res.status(200).json({
            data: {
                users: users,
                count: userCount
            }
        });
    }

    // Add new user
    if (req.method == 'POST') {
        const { email, instagramId } = req.query;
        if (email == undefined || instagramId == undefined || email == '' || instagramId == '') {
            prisma.$disconnect(); // No need to wait
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, missing email/instagramId params'
                }
            });
        }

        if(emailValidator(email) == false) {
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, invalid email'
                }
            });
        }

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                instagramId: instagramId
            }
        });

        prisma.$disconnect(); // No need to await
        return res.status(200).json({
            data: {
                message: 'Resource updated successfully',
                data: createdUser
            }
        });
    }

    return res.status(501).json({
        error: {
            code: 501,
            message: 'Not Implemented'
        }
    });
});