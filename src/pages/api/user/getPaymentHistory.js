import prisma from "@/lib/prisma"

export default async function handler(req, res) {

    const userId = JSON.parse(req.body).user
    // only allow PATCH
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
    // validate the request body
    if (!userId) {
        return res.status(400).json({ message: 'Bad Request' })
    }
    let data;
    try {
        data = await prisma.paymentHistory.findMany({
            where: {
              userId: parseInt(userId),
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
    res.status(200).json({data});
}
