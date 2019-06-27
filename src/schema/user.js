import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
      key: String!
      role: String!
      url: String!
    ): Token!

    signIn(email: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
    updateUser(username: String!): User!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    group: [Group!]
    password: String!
    role: String
    email: String!
  }

  type Group {
    id: ID!

  }
`;