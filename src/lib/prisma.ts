// ESM-compatible dynamic import for PrismaClient
let prisma: any;
if (typeof window === "undefined") {
  let PrismaClient;
  try {
    const prismaModule = await import("@prisma/client");
    PrismaClient =
      prismaModule.PrismaClient || prismaModule.default?.PrismaClient;
    if (!PrismaClient)
      throw new Error("PrismaClient not found in @prisma/client");
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
