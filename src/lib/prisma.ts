// Fix: Provide a fallback if PrismaClient is not available (for environments without @prisma/client)
let prisma: any;
try {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = global as unknown as { prisma: typeof PrismaClient };
  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: ["query"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (e) {
  // Fallback mock for environments without @prisma/client
  prisma = {};
}
export default prisma;
