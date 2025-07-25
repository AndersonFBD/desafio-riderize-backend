import { GraphQLContext as Context } from "../context";
import { pedal, inscricao } from "@prisma/client";
import { createPedalInput } from "../schemas/pedal";
import { IResolvers } from "@graphql-tools/utils";
import validarCreatePedal from "../../utils/pedalValidation";

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
      if (!context.user) {
        throw new Error("faça login para ver os pedais criados");
      }
      return context.prisma.pedal.findMany({
        where: {
          creator_id: context.user.id,
        },
        include: {
          subscriptions: true,
        },
      });
    },

    // quais pedais o usuário já participou/inscreveu-se?
    getSubscribedPedals: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<pedal[]> => {
      if (!context.user) {
        throw new Error("faça login para ver os pedais");
      }

      const pedalList = await context.prisma.inscricao.findMany({
        where: {
          user_id: context.user.id,
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
      if (!context.user)
        throw new Error("Faça Login para se inscrever no pedal");
      const usuario = context.user.id;
      const { pedalId } = args;
      const pedal = await context.prisma.pedal.findUnique({
        where: { id: pedalId },
      });
      if (!pedal) {
        throw new Error("Pedal não encontrado");
      }

      // o usuário já está inscrito no pedal?
      const jaInscrito = await context.prisma.inscricao.findFirst({
        where: {
          pedal_id: pedalId,
          user_id: usuario,
        },
      });

      if (jaInscrito) {
        throw new Error("Você já está inscrito neste pedal");
      }

      // numero de inscritos no pedal
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
          user_id: usuario!,
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
      if (!context.user) {
        throw new Error("faça login para criar um pedal");
      }
      const usuario = context.user.id;
      validarCreatePedal({
        start_date: String(args.data.start_date),
        start_date_registration: String(args.data.start_date_registration),
        end_date_registration: String(args.data.end_date_registration),
        participants_limit: Number(args.data.participants_limit),
      });
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
          creator: { connect: { id: usuario } },
        },
      });
      return newPedal;
    },
  },
};
