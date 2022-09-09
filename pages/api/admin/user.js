import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { emailValidator } from './../../../shared/utils';

import prisma from '../../../shared/prisma';

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = getSession(req, res);
    let userDb = null;

    // Check if user's admin
    if (req.method == 'GET' || req.method == 'POST') {
        userDb = await prisma.user.findFirst({
            where: {
                email: user.email
            }
        });

        // Check if User do not exist
        if (userDb == null) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: 'Not Found'
                }
            });
        }

        // Check if User is ADMIN
        if (userDb.role != 'ADMIN') {
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
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, missing email/instagramId params'
                }
            });
        }

        if (emailValidator(email) == false) {
            return res.status(400).json({
                error: {
                    code: 400,
                    message: 'Bad Request, invalid email'
                }
            });
        }

        let targetUserDb = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: email } },
                    { instagramId: { equals: instagramId } }
                ]
            }
        });
        // Check if email or instagramId exists
        if (targetUserDb != null) {
            return res.status(409).json({
                error: {
                    code: 409,
                    message: 'Email or InstagramId is already use'
                }
            });
        }

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                instagramId: instagramId
            }
        });

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