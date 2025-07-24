import { userTypeDefs } from "./schemas/user";
import { userResolvers } from "./resolvers/user";
import { pedalTypeDefs } from "./schemas/pedal";
import { pedalResolvers } from "./resolvers/pedal";
import { inscricaoTypeDefs } from "./schemas/inscricao";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { GraphQLContext } from "./context";
import { IResolvers } from "@graphql-tools/utils";

export const typeDefs = mergeTypeDefs([
  userTypeDefs,
  pedalTypeDefs,
  inscricaoTypeDefs,
]);
export const resolvers = mergeResolvers([
  userResolvers,
  pedalResolvers,
]) as IResolvers<unknown, GraphQLContext>;
