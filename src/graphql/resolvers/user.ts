import { user as userPrismaSchema } from "@prisma/client";
import { GraphQLContext, prisma } from "../context";
import bcrypt from "bcrypt";
import { IResolvers } from "@graphql-tools/utils";
import { tokenGeneration } from "../../middlewares/jwtMiddleware";
import { validarEmail } from "../../utils/userValidation";

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

      // normaliza o email
      email.trim().toLowerCase();

      // verificar se o formato do email está correto
      if (!validarEmail(email))
        throw new Error("O formato de email é inválido");

      // verifica se não existe um usuario com o email fornecido
      const emailExistente = await context.prisma.user.findUnique({
        where: { email },
      });

      if (emailExistente)
        throw new Error("Um usuário já está utilizando este email");

      // criptografa a senha
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
