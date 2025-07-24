import { user as userPrismaSchema } from "@prisma/client";
import { GraphQLContext } from "../context";
import bcrypt from "bcrypt";
import { IResolvers } from "@graphql-tools/utils";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export const userResolvers: IResolvers<GraphQLContext> = {
  Query: {
    // recuperar todos os usuários
    users: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ): Promise<userPrismaSchema[]> => {
      return context.prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      _args: { data: CreateUserInput },
      context: GraphQLContext
    ): Promise<userPrismaSchema> => {
      const { name, email, password } = _args.data;

      let hashedPassword = await bcrypt.hash(password, 10);

      return context.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    },
  },
};
