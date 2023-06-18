import { PrismaClient } from "@prisma/client";

// basically a singleton, only allows one PrismClient to be created

let prisma;
//Is a singleton that makes sure that we only have one prisma data server up
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;  