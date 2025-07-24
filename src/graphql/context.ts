import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  userId?: string | null;
}
