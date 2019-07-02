import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
    groups: [Group!]
    group(id: ID!): Group!
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
    createGroup(name: String!, members: [String!]): Group!
    deleteGroup(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User @key (fields: "username"){
    id: ID!
    username: String!
    group: [Group!]
    password: String!
    role: String
    email: String!
  }

  type Group @key (fields: "id"){
    id: ID!
    name: String!
    members: [User!]
  }
`;