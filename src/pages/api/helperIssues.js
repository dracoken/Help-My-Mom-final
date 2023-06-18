import prisma from "@/lib/prisma";

export default async function handler(req, res) 
{
    console.log("yhe");
    if(req.method != "GET")
    {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    const {helperId} = req.json; //we pass through only the id of the helper, and from there we can grab all their associated issues

    if(helperId <= 0)
    {
        res.status(404).json({ error: "Error, helperid sent < 1" });
        return;
    }

    try
    {
        let helperRemainingIssues = prisma.user.findMany({
            where:
            {
                id:helperId, //we find the helper whos currently being worked on issue, need to be shown
                Issue: { //we filter all issues the helper has, that are in progress //sidenote db assumes that helper dosen't have any created issues
                    ISNOT: 
                    {
                        solution:"done" //should get me all the issues that aren't done
                    }, 
                },
            },
        });
    
        if(helperRemainingIssues == null) //checks if the helper had an issue that 
        {
            res.status(404).json({ error: "Child not found" });
            return;
        }
    }
    catch(error ) {
        res.status(400).json({ error: "Something went wrong with finding child" });  //aka child is not in database
        return;
    }

    if (!helperRemainingIssues) {
        res.status(400).json({ error: "Something went wrong" });  //something went wrong when creating the new user record into the database
        return;
    }
    res.status(200).json({data:helperRemainingIssues}); //i beileve this sends an unordered json to the thing that fetches it.
}