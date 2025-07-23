import gql from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    pedal: [pedal!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
  type query {
    users: [User!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
  }
`;
