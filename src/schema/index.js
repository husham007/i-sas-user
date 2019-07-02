import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import User from './user';
import Group from './group';
import resolvers from '../resolvers'

 
const Query = `
  type Query {
    _empty: String
  }
`;

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, User, Group]

/*
export default makeExecutableSchema({
  typeDefs: [ linkSchema, User, Group ],
  resolvers,
  
});
*/


/*
const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, groupSchema];

*/

