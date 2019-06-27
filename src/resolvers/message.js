import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';


const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
    Query: {
        messages: async (parent, { cursor, limit = 100 }, { models }) => {
            const cursorOptions = cursor
              ? {
                  createdAt: {
                    $lt: fromCursorHash(cursor),
                  },
                }
              : {};
            const messages = await models.Message.find(
              cursorOptions,
              null,
              {
                sort: { createdAt: -1 },
                limit: limit + 1,
              },
            );
      
            const hasNextPage = messages.length > limit;
            const edges = hasNextPage ? messages.slice(0, -1) : messages;
      
            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: toCursorHash(
                  edges[edges.length - 1].createdAt.toString(),
                ),
              },
            };
          },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findById(id);
        },
    },
    // Overidding User Query resolver



    Message: {
        user: async (message, args, { models }) => {
            return await models.User.findById(message.userId);
        }
    },

    Mutation: {
        createMessage: combineResolvers(isAuthenticated, (parent, { text }, { me, models }) => {
            //const id = uuidv4();
            const message = models.Message.create({
                text,
                userId: me.id,
            });

            //models.messages[id] = message;
            //models.users[me.id].messageIds.push(id);
            return message;
        }),
        deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, async (parent, { id }, { models }) => {
            //const { [id]: message, ...otherMessages } = models.messages;
            const message = await models.Message.findById(id);

            if (!message) {
                return false;
            } else {
                await message.remove();
                return true;
            }


        }),
    }

}