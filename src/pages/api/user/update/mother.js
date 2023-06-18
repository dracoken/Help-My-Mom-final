import prisma from "@/lib/prisma";
import sendEmail from "@/lib/sendEmail";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(updatePasswordRoute, sessionOptions);

async function updatePasswordRoute(req, res) {
    const user = req.session.user;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (!user) {
        res.status(401).json({ error: "Not logged in" });
        return;
    }

    const { mothers_email, mothers_password } = req.body;

    if (!mothers_email || !mothers_password) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }

    try {
        let userRecord = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (!userRecord) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const motherCheck = await prisma.user.findUnique({
            where: {
                email: mothers_email
            }
        });

        if (motherCheck) {
            res.status(404).json({ error: "Email already in use." });
            return;
        }

        const motherRecord = await prisma.user.create({
            data: {
                email: mothers_email,
                password: mothers_password,
                is_mother: true,
                child: {
                    connect: {
                        id: userRecord.id
                    }
                }
            },
            include: {
                child: true
            }
        })

        userRecord = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                mother: true
            }
        });

        if (!motherRecord) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        const _ = await sendEmail(mothers_email, "Welcome to Help My Mom!",
            `You have been added as a mother to a child's account. You can now log in and create and view issues.\n\nYour email is ${mothers_email} and your password is ${mothers_password}.\n\nThank you for using Help My Mom!`
        );

        res.status(200).json({ message: "Mother account created successfully.", mother: motherRecord, user: userRecord });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                res.status(400).json({ error: "Email already in use" });
                return;
            }
        } else {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
}