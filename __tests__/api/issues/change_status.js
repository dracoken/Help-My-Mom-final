import { issueStatus } from "@/lib/issues";
import changeIssueStatusHandler from "@/pages/api/issues/changeIssueStatus";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.Issue.update = jest.fn((data) => {
        if(data.where.id === 2) {
            throw new Error();
        }

        return {
            id: 1,
            issueStatus: data.data.status,
        };
    })

    return prisma;
});

jest.mock('@/lib/notifyUser', () => {
    return {
      notifyUsers: jest.fn(),
    };
  });

describe('API Route: /api/issues/changeIssueStatus', () => {
    it('should return 405 if method is not POST', async () => {
        const req = {
            method: 'GET',
            body: {
                id: 1,
                status: issueStatus.NEW,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
    })

    it('should return 400 if id or status is not provided', async () => {
        const req = {
            method: 'POST',
            body: {},
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad request' });
    })

    it('should return 400 if an error occurs', async () => {
        const req = {
            method: 'POST',
            body: {
                id: 2,
                status: issueStatus.NEW,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong with finding the issue' });
    })

    it('should return 200 and the updated issue (new)', async () => {
        const req = {
            method: 'POST',
            body: {
                id: 1,
                status: issueStatus.NEW,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { id: 1, issueStatus: issueStatus.ASSIGNED } });
    })

    it('should return 200 and the updated issue (assigned)', async () => {
        const req = {
            method: 'POST',
            body: {
                id: 1,
                status: issueStatus.ASSIGNED,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { id: 1, issueStatus: issueStatus.SOLVING } });
    })

    it('should return 200 and the updated issue (solving)', async () => {
        const req = {
            method: 'POST',
            body: {
                id: 1,
                status: issueStatus.SOLVING,
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await changeIssueStatusHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { id: 1, issueStatus: issueStatus.SOLVED } });
    })
});