import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    me: async (parent, args, { me, models }) => {
      if (!me) {
        return null;
      };
      return await models.User.findById(me.id)
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },

  },
  // Overidding User Query resolver



  Mutation: {
    signUp: async (
      parent,
      { username, email, password, key, url },
      { models, secret, student, teacher },
    ) => {
      let role;
      //console.log(username, email, password, key);

      if (key === student) {
        role = 'STUDENT';
      } else if (key === teacher) {
        role = 'ADMIN';
      } else {
        throw new UserInputError(
          'Invalid Key: Not authorized to SignUp',
        );
      }



      const user = await models.User.create({
        username,
        email,
        password,
        role,
        url,
      });

      //console.log(user);

      return { token: createToken(user, secret, '30m') };
    },
    signIn: async (
      parent,
      { email, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(email);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        return await models.User.findByIdAndUpdate(
          me.id,
          { username },
          { new: true },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  User: {

    async __resolveReference(parent, args, { me }) {
      return await models.User.findById(parent.id)
    }

    /*
    messages: async (user, args, { models }) => {
          return await models.Message.find({ userId: user.id });
      

      }
      */
  },

}