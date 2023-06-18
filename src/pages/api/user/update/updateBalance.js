import prisma from "@/lib/prisma"

export default async function handler(req, res) {

    const { toAdd, userId } = req.body;
    // only allow PATCH
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
    // validate the request body
    if (!toAdd || !userId) {
        return res.status(400).json({ message: 'Bad Request' })
    }
    let user;
    try {
        user = await prisma.User.findUnique({
            where: {
              id: parseInt(userId),
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
    let currentBalance=user?.money;
    let updatedUser;
    try {
        updatedUser = await prisma.User.update({
            where: {
              id: parseInt(userId),
            },
            data: {
                money: parseFloat(toAdd)+currentBalance
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
    res.status(200).json({ success: true})
}