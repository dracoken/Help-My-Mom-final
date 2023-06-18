import registerHandler from '@/pages/api/register';

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.user.create = jest.fn((data) => {
        if (data.data.email === 'test@test.com') {
            const error = {
                code: 'P2002',
                meta: {
                    target: ['email'],
                },
            };
            throw error;
        } else {
            return {
                id: 1,
                ...data.data,
            };
        }
    });

    return prisma;
});

describe('API Route: /api/register', () => {
    it('should return 405 if method is not POST', async () => {
        const req = {
            method: 'GET',
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await registerHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should return 400 if email is already in use', async () => {
        const req = {
            method: 'POST',
            body: {
                email: 'test@test.com',
                is_helper: false,
                password: 'password',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await registerHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
    });

    it('should return 400 if email or password is missing', async () => {
        const req = {
            method: 'POST',
            body: {
                email: '',
                is_helper: false,
                password: '',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await registerHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing email or password' });
    });
});