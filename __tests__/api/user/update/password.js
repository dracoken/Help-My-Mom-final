import { updatePasswordHandler } from "@/pages/api/user/update/password";

jest.mock('@/lib/prisma', () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    prisma.user.findUnique = jest.fn((data) => {
        if (data.where.id === 5) {
            return null;
        }

        if (data.where.id === 6) {
            return {
                password: 'notwrong'
            }
        }

        return {
            id: data.where.id,
            password: 'oldpassword'
        };
    });

    prisma.user.update = jest.fn((data) => {
        if (data.where.id === 1) {
            return {
                id: 1,
                password: 'newpassword'
            }
        }

        if (data.where.id === 7) {
            throw new Error()
        }

        return null;
    });

    return prisma;
});


describe('API Route: /api/user/update/password', () => {
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

        await updatePasswordHandler(req, res);

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

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Logged In' });
    })

    it('should return 400 if missing fields', async () => {
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

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing Fields' });
    })

    it('should return 400 if passwords do not match', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {}
            },
            body: {
                old_password: 'password',
                new_password: 'password1',
                confirm_password: 'password2',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Passwords do not match' });
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
                old_password: 'password',
                new_password: 'password',
                confirm_password: 'password',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User Not Found' });
    })

    it('should return 400 if old password is incorrect', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 6
                }
            },
            body: {
                old_password: 'wrong',
                new_password: 'password',
                confirm_password: 'password',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect password' });
    })

    it('should return 500 if error updating user', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 7
                }
            },
            body: {
                old_password: 'oldpassword',
                new_password: 'password',
                confirm_password: 'password',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    })

    it('should return 500 if error caught', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 7
                }
            },
            body: {
                old_password: 'oldpassword',
                new_password: 'password',
                confirm_password: 'password',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    })

    it('should return 200 if password is updated', async () => {
        const req = {
            method: 'POST',
            session: {
                user: {
                    id: 1
                }
            },
            body: {
                old_password: 'oldpassword',
                new_password: 'newpassword',
                confirm_password: 'newpassword',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await updatePasswordHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password updated', user: {
                id: 1,
                password: 'newpassword',
            }
        });
    })
});