import { gql } from 'apollo-server-express';
// This file is not in use but kept for use in future
export default gql`
  extend type Query {
    groups: [Group!]
    group(id: ID!): Group!
  }

  extend type Mutation {
    createGroup(name: String!, members: [String!]): Group!
    deleteGroup(id: ID!): Boolean!
  }  

  
`;