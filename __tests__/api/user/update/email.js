import { updateEmailHandler } from "@/pages/api/user/update/email";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.user.findUnique = jest.fn((data) => {
        if (data.where.id === 5) {
            return null;
        }
        return {
            id: data.where.id,
            name: 'Test User',
            email: 'old@test.com'
        };
    });

    prisma.user.update = jest.fn((data) => {
        if (data.where.id === 1) {
            return {
                id: 1,
                name: 'Test User',
                email: data.data.email,
            };
        }

        if (data.where.id === 6) {
            throw new Error();
        }

        return null;
    });

    return prisma;
});

describe('API Route: /api/user/update/email', () => {
    it('should return 405 if method is not POST', async () => {
        const req = {
            method: 'GET',
            session: {
                user: {}
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
    })

    it('should return 401 if user is not logged in', async () => {
        const req = {
            method: 'POST',
            session: {
                user: null
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Logged In' });
    })

    it('should return 400 if new_email is not provided', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {}
            },
            body: {}
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing Fields' });
    })

    it('should return 404 if user is not found', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 5
                }
            },
            body: {
                new_email: 'new@test.com',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User Not Found' });
    })

    it('should return 500 if user is not updated', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 6
                }
            },
            body: {
                new_email: 'new@test.com',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it('should return 200 if user is updated', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 1
                }
            },
            body: {
                new_email: 'new@test.com',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updateEmailHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email updated', user: { id: 1, name: 'Test User', email: 'new@test.com' } });
    });
});