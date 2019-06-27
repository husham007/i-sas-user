import { ForbiddenError } from 'apollo-server';
import {combineResolvers,  skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>{
  me ? skip : new ForbiddenError('Not authenticated as user.');
 
}

  

  export const isMessageOwner = async (
    parent,
    { id },
    { models, me },
  ) => {
    const message = await models.Message.findById(id);
  
    if (message.userId != me.id) {
      throw new ForbiddenError('Not authenticated as owner.');
    }
  
    return skip;
  };

  export const isQuestionOwner = async (
    parent,
    { id },
    { models, me },
  ) => {
   
    const question = await models.Question.findById(id);
  
    if (question.author != me.id) {
      throw new ForbiddenError('Not authenticated as owner.');
    }
  
    return skip;
  };

  export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) =>
      role === 'ADMIN'
        ? skip
        : new ForbiddenError('Not authorized as admin.'),
  );