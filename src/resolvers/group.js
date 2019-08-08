import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isTest } from './authorization';




export default {
  Query: {
    groups: async (parent, params, { models }) => {
      console.log('groups');
      const groups = await models.Group.find(
        {},
        null,
        {
          sort: { createdAt: -1 },
          limit: 10,
        },
      );


      return groups
    },
    group: async (group, { id }, { models }) => {
      return await models.Group.findById(id);
    },
  },

  Group: {
    async __resolveReference(group, { id }, { models }) {
      return await models.Group.findById(group.id);
    },
    members: async (parent, args, { models }) => {
      return parent.members.map(memberId => {
        return models.User.findById(memberId);
      })
    },
  },

  Mutation: {
    createGroup: combineResolvers(isTest, (parent, { name, members }, { me, models }) => {
      //const id = uuidv4();
      const group = models.Group.create({
        name,
        members,
      });

      //models.messages[id] = message;
      //models.users[me.id].messageIds.push(id);
      return group;
    }),
    deleteGroup: combineResolvers(isAdmin, async (parent, { id }, { models }) => {
      //const { [id]: message, ...otherMessages } = models.messages;
      const group = await models.Group.findById(id);

      if (!group) {
        return false;
      } else {
        await group.remove();
        return true;
      }


    }),

    publishExamToGroup: async (parent, { examId, groupId, time, duration }, { models }) => {
      const group = await models.Group.findById(groupId);
      //console.log(group);
      if (!group) {
        return false;
      }
      else if (group.members.length !== 0) {
        //console.log(group.members);
        group.members.forEach(async memberId => {

          const user = await models.User.findOne({ _id: memberId });
          user.exams.set(examId,
            { exam: examId, status: "assigned", solution: null, time, duration, report: null });

          if (await user.save()) {
            return true;
          } else {
            return false;
          }

          /*
            await models.User.findOneAndUpdate(
             {_id: memberId}, { $push: {exams: examId}}, 
             );  
             */
        });
        return true;
      } else return false;
    },
  }

}