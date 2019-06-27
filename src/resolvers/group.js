import { combineResolvers } from 'graphql-resolvers';
import { isAdmin } from './authorization';




export default {
    Query: {
        groups: async (parent, params, { models }) => {
           
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
        group: async (parent, { id }, { models }) => {
            return await models.Group.findById(id);
        },
    },

    Mutation: {
        createGroup: combineResolvers(isAdmin, (parent, { name, members }, { me, models }) => {
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
    }

}