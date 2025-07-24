import { GraphQLContext as Context } from "../context";
import { pedal, inscricao } from "@prisma/client";
import { createPedalInput } from "../schemas/pedal";
import { IResolvers } from "@graphql-tools/utils";

interface SubscribeUseronPedalArgs {
  pedalId: string;
}

export const pedalResolvers: IResolvers<Context> = {
  Query: {
    // quais pedais estão disponíveis?
    availablePedals: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<pedal[]> => {
      const now = new Date();
      return context.prisma.pedal.findMany({
        where: {
          end_date_registration: {
            gte: now,
          },
        },
        include: {
          creator: true, // incluir o criador do pedal
          subscriptions: true, // incluir inscrições
        },
      });
    },

    //quais pedais o usuário criou?
    getCreatedPedals: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<pedal[]> => {
      if (!context.userId) {
        throw new Error("faça login para ver os pedais criados");
      }
      return context.prisma.pedal.findMany({
        where: {
          creator_id: context.userId,
        },
        include: {
          subscriptions: true,
        },
      });
    },

    // quais pedais o usuário está participou/inscreveu-se?
    getSubscribedPedals: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<pedal[]> => {
      if (!context.userId) {
        throw new Error("faça login para ver os pedais");
      }

      const pedalList = await context.prisma.inscricao.findMany({
        where: {
          user_id: context.userId,
        },
        include: {
          pedal: true, // incluir os detalhes do pedal
        },
      });
      return pedalList.map((inscricao) => inscricao.pedal);
    },
  },
  // inscrever usuário em um pedal
  Mutation: {
    subscribeUserOnPedal: async (
      _parent: unknown,
      args: SubscribeUseronPedalArgs,
      context: Context
    ): Promise<inscricao> => {
      const { pedalId } = args;
      const pedal = await context.prisma.pedal.findUnique({
        where: { id: pedalId },
      });
      if (!pedal) {
        throw new Error("Pedal não encontrado");
      }
      const countSubscriptions = await context.prisma.inscricao.count({
        where: { pedal_id: pedalId },
      });
      // verificar se o limite de participantes foi atingido
      if (
        pedal.participants_limit &&
        countSubscriptions >= pedal.participants_limit
      ) {
        throw new Error("Limite de participantes atingido");
      }
      if (new Date() > pedal.end_date_registration) {
        throw new Error("Período de inscrição encerrado");
      }
      const subscription = await context.prisma.inscricao.create({
        data: {
          pedal_id: pedalId,
          user_id: context.userId!,
        },
        include: {
          pedal: true, // incluir os detalhes do pedal
          user: true, // incluir os detalhes do usuário
        },
      });
      return subscription;
    },
    // criar um novo pedal
    createPedal: async (
      _parent: unknown,
      args: { data: createPedalInput },
      context: Context
    ): Promise<pedal> => {
      if (!context.userId) {
        throw new Error("faça login para criar um pedal");
      }

      const startDate = new Date(args.data.start_date);
      const startDateRegistration = new Date(args.data.start_date_registration);
      const endDateRegistration = new Date(args.data.end_date_registration);
      // validações de datas
      if (endDateRegistration <= startDateRegistration) {
        throw new Error(
          "A data de encerramento da inscrição deve ser posterior à data de início do pedal"
        );
      }
      if (startDateRegistration <= new Date()) {
        throw new Error("A data de início da inscrição deve ser futura");
      }
      if (startDate <= new Date()) {
        throw new Error("A data de início do pedal deve ser futura");
      }
      // validação de limite de participantes
      if (args.data.participants_limit && args.data.participants_limit <= 0) {
        throw new Error(
          "O limite de participantes deve ser um número positivo"
        );
      }
      // criar o pedal
      const newPedal = await context.prisma.pedal.create({
        data: {
          name: args.data.name,
          start_date: new Date(args.data.start_date),
          start_date_registration: new Date(args.data.start_date_registration),
          end_date_registration: new Date(args.data.end_date_registration),
          additional_information: args.data.additional_information,
          start_place: args.data.start_place,
          participants_limit: args.data.participants_limit,
          creator: { connect: { id: context.userId } },
        },
      });
      return newPedal;
    },
  },
};
