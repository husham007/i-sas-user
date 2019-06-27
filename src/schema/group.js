import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    groups: [Group!]
    group(id: ID!): Group!
  }

  extend type Mutation {
    createGroup(name: String!, members: [String!]): Group!
    deleteGroup(id: ID!): Boolean!
  }
  

  type Group {
    id: ID!
    name: String!
    members: [User!]
  }
`;