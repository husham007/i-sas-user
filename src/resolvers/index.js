import userResolvers from './user';
import messageResolvers from './message';
import questionResolvers from './question';
import questionBookResolvers from './questionBook';
import groupResolvers from './group';
import { merge } from 'lodash';

//export default [userResolvers, messageResolvers, questionResolvers, questionBookResolvers, groupResolvers];

const resolvers = {};
export default merge(resolvers, userResolvers, groupResolvers);

//export default [userResolvers, groupResolvers];