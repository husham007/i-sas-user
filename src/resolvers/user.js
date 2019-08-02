import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated, isTest } from './authorization';

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
    initializeUserExamSolution: combineResolvers(
      isTest,
      async (parent, { examId, userId }, { models, me }) => {
        const user = await models.User.findOne({ _id: userId });
        if (!user.examSolutions) {
          user.examSolutions = new Map();
        }
        user.examSolutions.set(examId, { examId, status: "Initialized" });       
        if (await user.save()) {
          return true;
        } else {
          return false;
        }
        /*
              return await models.User.findOneAndUpdate(
                  {_id: userId},
                  { $push: { examSolutions: examId } },
                  {new: true}
               );
           */
      },
    ),


    finalizeUserExamSolution: combineResolvers(
      isTest,
      async (parent, { examId, userId }, { models, me }) => {
        const user = await models.User.findOne({ _id: userId });
        if (!user.examSolutions) {
          user.examSolutions = new Map();
        }
        user.examSolutions.set(examId, { examId, status: "finalized" });       
        if (await user.save()) {
          return true;
        } else {
          return false;
        }
        /*
              return await models.User.findOneAndUpdate(
                  {_id: userId},
                  { $push: { examSolutions: examId } },
                  {new: true}
               );
           */
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

    async __resolveReference(parent, { me, models }) {
      //console.log(models);
      return await models.User.findById(parent.id)
    },

    exams(user) {
      //console.log('exam', exam.questions);
      return user.exams.map(examId => {
        return { __typename: "Exam", id: examId }

      })
    },
    examSolutions(user) {
      //console.log('exam', exam.questions);
      let examSolutions = [...user.examSolutions.values()];
      return examSolutions.map(examSolution => {
        return {
          examSolution: { __typename: "ExamSolution", id: examSolution.examId },
          status: examSolution.status
        }

      })
      /*
      return user.examSolutions.map(examSolutionId=> {
        return { __typename: "ExamSolution", id: examSolutionId }        
        
      })
      */
    },

    /*
    messages: async (user, args, { models }) => {
          return await models.Message.find({ userId: user.id });
      

      }
      */
  },

}