import { loginHandler } from '@/pages/api/login';

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.user.findUnique = jest.fn((data) => {
        if (data.where.email === 'bad@pass.com') {
            return {
                id: 1,
                email: 'bad@pass.com',
                password: 'badpass',
            };
        }

        if(data.where.email === 'notfound@test.com') {
            return null;
        }

        if(data.where.email === '') {
            throw new Error();
        }

        return {
            id: 1,
            email: 'good@test.com',
            password: 'password',
            is_helper: false,
            is_mother: false,
        };
    });

    return prisma;
});

describe('API Route: /api/login', () => {
    it('should return 401 if password is incorrect', async () => {
        const req = {
            method: 'POST',
            body: {
                email: 'bad@pass.com',
                password: 'wrongpass',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 404 if user is not found', async () => {
        const req = {
            method: 'POST',
            body: {
                email: 'notfound@test.com',
                password: 'password',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 if email or password is missing', async () => {
        const req = {
            method: 'POST',
            body: {
                email: '',
                password: '',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
    });

    it('should return 200 if login is successful', async () => {
        const req = {
            method: 'POST',
            body: {
                email: 'good@test.com',
                password: 'password',
            },
            session: {
                user: {},
                save: jest.fn(),
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await loginHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            isLoggedIn: true,
            id: 1,
            email: 'good@test.com',
            is_helper: false,
            is_mother: false,
        });
    });
});