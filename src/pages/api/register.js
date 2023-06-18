import prisma from "@/lib/prisma";

export default async function registerHandler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { email, helper, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
    }

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                is_helper: helper,
                password: password,
            }
        });

        if (!user) {
            res.status(400).json({ error: "Something went wrong" });
            return;
        }

        return res.status(200).json({ data: user });
    } catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({ error: "Email already in use" });
            return;
        } else {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
}