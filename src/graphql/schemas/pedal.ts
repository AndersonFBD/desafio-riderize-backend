import { gql } from "graphql-tag";

export const pedalTypeDefs = gql`
  type pedal {
    id: ID!
    name: String!
    start_date: String!
    start_date_registration: String!
    end_date_registration: String!
    additional_information: String
    start_place: String!
    participants_limit: Int
    creator_id: user!
    subscriptions: [inscricao!]!
  }

  input CreatePedalInput {
    name: String!
    start_date: String!
    start_date_registration: String!
    end_date_registration: String!
    additional_information: String
    start_place: String!
    participants_limit: Int
  }

  type Query {
    availablePedals: [Pedal!]!
    PedalById(id: ID!): Pedal
    userPedals: [Pedal!]!
  }

  type Mutation {
    createPedal(data: CreatePedalInput!): Pedal!
    subscribeUserOnPedal(pedalId: String!): inscricao!
  }
`;

export interface createPedalInput {
  name: string;
  start_date: string;
  start_date_registration: string;
  end_date_registration: string;
  additional_information?: string | null;
  start_place: string;
  participants_limit?: number | null;
  creator_id: string;
}
