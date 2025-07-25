import { PrismaClient, user } from "@prisma/client";

export const prisma = new PrismaClient();

export interface GraphQLContext {
  prisma: PrismaClient;
  user: user | null;
}
