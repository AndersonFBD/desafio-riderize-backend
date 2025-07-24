import { gql } from "graphql-tag";

export const inscricaoTypeDefs = gql`
  type Inscricao {
    id: ID!
    user: User!
    pedal: Pedal!
    created_at: String!
  }

  type Query {
    allInscricoes: [Inscricao!]!
  }
`;
