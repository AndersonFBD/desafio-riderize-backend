import { user as userPrismaSchema } from "@prisma/client";
import { GraphQLContext, prisma } from "../context";
import bcrypt from "bcrypt";
import { IResolvers } from "@graphql-tools/utils";
import { tokenGeneration } from "../../middlewares/jwtMiddleware";

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
    login: async (
      _parent: unknown,
      _args: { email: string; password: string }
    ) => {
      const { email, password } = _args;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error("Usuário não encontrado");
      if (!(await bcrypt.compare(password, user.password)))
        throw new Error("senha incorreta");

      const token = tokenGeneration(user);
      return {
        token,
        user,
      };
    },
  },
};
