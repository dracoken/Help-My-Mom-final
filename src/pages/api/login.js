import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    // check to see if the user exists in the database
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    } catch (error) {
        res.status(400).json({ error: "Something went wrong" });
        return;
    }

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    // check to see if the password matches
    if (user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    // setup the session data
    const data = {
        isLoggedIn: true,
        id: user.id,
        email: user.email,
        is_helper: user.is_helper,
        is_mother: user.is_mother,
    }

    req.session.user = data;

    await req.session.save();

    res.status(200).json(data);
};

export default withIronSessionApiRoute(loginHandler, sessionOptions);
