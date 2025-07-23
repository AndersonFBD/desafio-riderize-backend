import { user as userPrismaSchema } from "@prisma/client";
import { GraphQLContext } from "../context";
import bcrypt from "bcrypt";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export const userResolvers = {
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
    ) => {
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
