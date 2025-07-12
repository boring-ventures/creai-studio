// ESM-compatible import for PrismaClient
let prisma: any;
if (typeof window === "undefined") {
  let PrismaClient;
  try {
    // This works for both ESM and CJS in all modern environments
    const { PrismaClient: PrismaClientImport } = await import("@prisma/client");
    PrismaClient = PrismaClientImport;
    const globalForPrisma = global as unknown as {
      prisma: typeof PrismaClient;
    };
    prisma =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: ["query"],
      });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  } catch (e) {
    prisma = {};
  }
} else {
  prisma = {};
}
export default prisma;
