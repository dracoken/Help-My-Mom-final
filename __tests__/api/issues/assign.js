import { issueStatus } from "@/lib/issues";
import assignIssueHandler from "@/pages/api/issues/assign";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.Issue.update = jest.fn((data) => {
        if(data.where.id === 2) {
            throw new Error();
        }

        return {
            id: 1,
            issueStatus: issueStatus.ASSIGNED,
            helper: {
                notify: false,
            }
        };
    })

    return prisma;
});

describe('API Route: /api/issues/assign', () => {
    it('should return 405 if method is not POST', async () => {
        const req = {
            method: 'GET',
            body: {
                helper: 1,
                issue: 1,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await assignIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
    })

    it('should return 400 if helper or issue is not provided', async () => {
        const req = {
            method: 'POST',
            body: {},
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await assignIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    })

    it('should return 400 if an error occurs', async () => {
        const req = {
            method: 'POST',
            body: {
                helper: 1,
                issue: 2,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await assignIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error updating issue' });
    })

    it('should return 200 if issue is updated', async () => {
        const req = {
            method: 'POST',
            body: {
                helper: 1,
                issue: 1,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await assignIssueHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ issue: { id: 1, issueStatus: issueStatus.ASSIGNED, helper: { notify: false } } });
    })
});