import { issueStatus } from "@/lib/issues";
import createIssueHandler from "@/pages/api/issues/create";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.Issue.create = jest.fn((data) => {
        if (data.data.title === 'title' && data.data.description === 'description' && data.data.complainer.connect.id === 1) {
            return {
                id: 1,
                title: 'title',
                description: 'description',
                status: issueStatus.NEW,
            };
        }

        if (data.data.title === 'error' && data.data.description === 'description') {
            throw new Error();
        }
    })

    return prisma;
});

describe('API Route: /api/issues/create', () => {
    it('should return 405 if method is not POST', async () => {
        const req = {
            method: 'GET',
            body: {
                title: 'title',
                description: 'description',
                userId: 1,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await createIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
    });

    it('should return 400 if request body is invalid', async () => {
        const req = {
            method: 'POST',
            body: {
                title: 'title',
                description: 'description',
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await createIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    });

    it('should return 500 if there is an error', async () => {
        const req = {
            method: 'POST',
            body: {
                title: 'error',
                description: 'description',
                userId: 1,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await createIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal Server Error' });
    });

    it('should return 200 if issue is created successfully', async () => {
        const issue = {
            title: 'title',
            description: 'description',
            userId: 1,
        }
        const req = {
            method: 'POST',
            body: issue,
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await createIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, issue: {
            id: 1,
            title: 'title',
            description: 'description',
            status: issueStatus.NEW,
        } });
    });
});