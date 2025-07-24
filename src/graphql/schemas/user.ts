import gql from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    inscricoes: [Inscricao!]!
    pedals: [Pedal!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
  }
`;
