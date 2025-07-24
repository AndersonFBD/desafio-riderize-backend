import { gql } from "graphql-tag";

export const pedalTypeDefs = gql`
  type Pedal {
    id: ID!
    name: String!
    start_date: String!
    start_date_registration: String!
    end_date_registration: String!
    additional_information: String
    start_place: String!
    participants_limit: Int
    creator_id: User!
    subscriptions: [Inscricao!]!
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
    getCreatedPedals: [Pedal!]!
    getSubscribedPedals: [Pedal!]!
  }

  type Mutation {
    createPedal(data: CreatePedalInput!): Pedal!
    subscribeUserOnPedal(pedalId: String!): Inscricao!
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
