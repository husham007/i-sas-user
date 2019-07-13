import userResolvers from './user';
import messageResolvers from './message';
import questionResolvers from './question';
import questionBookResolvers from './questionBook';
import groupResolvers from './group';
import { merge } from 'lodash';
import { GraphQLDateTime } from 'graphql-iso-date';

//export default [userResolvers, messageResolvers, questionResolvers, questionBookResolvers, groupResolvers];

const customScalarResolver = {
    Date: GraphQLDateTime,
  };
const resolvers = {};
export default merge(resolvers, userResolvers, groupResolvers, customScalarResolver);

//export default [userResolvers, groupResolvers];