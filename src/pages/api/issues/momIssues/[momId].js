import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";

export default async function handler (req,res)
{
    const { momId } = req.query;
    console.log("in api");
    if (req.method != "GET") 
    {
        return res.status(400).json({ error: "Method not allowed" });
    }

    if (!momId) 
    {
         return res.status(400).json({ error: "Bad request" });
    }

    let issues;
    let mom;
    let realMomId = 0;
    mom = await prisma.User.findUnique({
        where:{
            id:parseInt(momId),
        }
    });

    if(mom.is_mother === true)
    {
        return res.status(400).json({error: "Id sent is of a mother"});
    }
    realMomId = mom.motherId;

    mom = await prisma.User.findUnique({
        where:
        {
            id:realMomId,
        }
    });

    if(mom.issuesCreated === null)
    {
        return res.status(400).json({error:"mom dosen't have any issues"});
    }
    return res.status(200).json({data:mom.issuesCreated});

}