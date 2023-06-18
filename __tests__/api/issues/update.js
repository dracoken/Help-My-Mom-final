import updateIssueHandler from "@/pages/api/issues/[issueId]";
import { issueStatus } from "@/lib/issues";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.Issue.update = jest.fn((data) => {
        if (data.data.description === 'error') {
            throw new Error();
        }
        return {
            id: 1,
            title: 'Issue title',
            description: 'updated description',
            status: issueStatus.NEW,
        }
    })

    prisma.Issue.findUnique = jest.fn((data) => {
        if (data.where.id === 1) {
            return {
                id: 1,
                title: 'Issue title',
                description: 'Issue description',
                status: issueStatus.NEW,
            }
        }
        return null;
    })

    return prisma;
});

describe('API Route: /api/issues/[issueId]', () => {
    it('should return 400 if request body is invalid', async () => {
        const req = {
            method: 'PATCH',
            body: {},
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await updateIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    })

    it('should return 405 if request method is not PATCH', async () => {
        const req = {
            method: 'GET',
            body: {},
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await updateIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
    })

    it('should return 404 if issue is not found', async () => {
        const req = {
            method: 'PATCH',
            body: {
                helperId: 1,
            },
            query: {
                issueId: 2,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await updateIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Issue not found' });
    })

    it('should return 500 if issue is not updated successfully', async () => {
        const req = {
            method: 'PATCH',
            body: {
                description: 'error',
                helperId: 1,
            },
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await updateIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal Server Error' });
    })

    it('should return 200 if issue is updated successfully', async () => {
        const req = {
            method: 'PATCH',
            body: {
                description: 'updated description',
                helperId: 1,
            },
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await updateIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            issue: {
                id: 1,
                title: 'Issue title',
                description: 'updated description',
                status: issueStatus.NEW,
            }
        });
    });
});