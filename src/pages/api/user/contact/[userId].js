import prisma from "@/lib/prisma"

export default async function findContactMethods(req,res)
{
    const { userId } = req.query;
    console.log(userId);

    if(req.method != "GET")
    {
        return res.status(400).json({ error: 'Method Not Allowed' })
    }
    // validate the request body
    

    let contactMethod;
    contactMethod = await prisma.ContactMethods.findUnique({
        where:
        {
            userId: parseInt(userId),
        }
    });
    if(contactMethod == null)
    {
        contactMethod = await prisma.ContactMethods.create({
            data:
            {
                userId: parseInt(userId),
            },
        });
        return res.status(400).json({ error: "helper dosen't have a contact method yet, so we created it", contactMeth:contactMethod })
    }
    return res.status(200).json(contactMethod);
}