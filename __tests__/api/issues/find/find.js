import findIssueHandler from '@/pages/api/issues/find/[issueId]';
import { issueStatus } from '@/lib/issues';

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.Issue.findUnique = jest.fn((data) => {
        if (data.where.id === 1) {
            return {
                id: 1,
                title: 'Issue title',
                description: 'Issue description',
                solution: 'Issue solution',
                status: issueStatus.NEW,
                helper: {
                    id: 1,
                }
            }
        }

        if(data.where.id === 5) {
            throw new Error();
        }

        return null;
    })

    return prisma;
});

describe('API Route: /api/issues/[issueId]', () => {
    it('should return 400 if request query is invalid', async () => {
        const req = {
            method: 'GET',
            query: {
                issueId: null,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await findIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    })

    it('should return 405 if request method is not GET', async () => {
        const req = {
            method: 'POST',
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await findIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
    })

    it('should return 404 if issue is not found', async () => {
        const req = {
            method: 'GET',
            query: {
                issueId: 2,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await findIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Issue not found' });
    })

    it('should return 500 if there is an error', async () => {
        const req = {
            method: 'GET',
            query: {
                issueId: 5,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await findIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal Server Error' });
    })

    it('should return 200 if issue is found', async () => {
        const req = {
            method: 'GET',
            query: {
                issueId: 1,
            }
        }
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        }

        await findIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            issue: {
                id: 1,
                title: 'Issue title',
                description: 'Issue description',
                solution: 'Issue solution',
                status: issueStatus.NEW,
                helper: {
                    id: 1,
                }
            }
        });
    })
});