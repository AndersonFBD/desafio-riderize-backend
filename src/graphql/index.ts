import { userTypeDefs } from "./schemas/user";
import { userResolvers } from "./resolvers/user";
import { pedalTypeDefs } from "./schemas/pedal";
import { pedalResolvers } from "./resolvers/pedal";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

export const typeDefs = mergeTypeDefs([userTypeDefs, pedalTypeDefs]);
export const resolvers = mergeResolvers([userResolvers, pedalResolvers]);
