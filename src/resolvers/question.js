import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isQuestionOwner, isAdmin } from './authorization';
import { stat } from 'fs';


const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

  export default {
      Query: {
          questions: async (parent, {cursor, limit = 10}, {models}) => {
            
              const cursorOptions = cursor ? {
                  createdAt: {
                      $lt: fromCursorHash(cursor),
                  },
              }
              : {};
              let page = await models.Question.find(cursorOptions, null, {
                  sort: { createdAt: -1},
                  limit: limit + 1,
              });

              const hasNextPage = page.length > limit;
              const questions = hasNextPage ? page.slice(0,-1): page;
             
              return {
                  page: questions, 
                  pageInfo: {
                      hasNextPage,
                      endCursor: toCursorHash(questions[questions.length - 1].createdAt.toString(),
                      ),
                  },
              };
          },
          question: async (parent, {id}, {models})=>{
              return await models.Question.findById(id);
          },
          searchQuestion: async (parent, {searchInput}, {models})=>{
             // console.log(searchInput.statement);
            let {statement, type, category, level, book} = searchInput;
             //{ name: { $regex: /acme.*corp/, $options: "si" } }}
             let regEx = new RegExp(statement);           
            let searchObj = {};

            if (statement) searchObj.statement = { $regex: regEx, $options: "i" };
            if (type) searchObj.type = type;
            if (category) searchObj.category = category;
            if (level) searchObj.level = level;
            if (book) searchObj.book = book;
            

            // let regex = `/${searchInput.statement}/`;
            
             let questions = models.Question.find(searchObj)
                 

            return questions;
        },
      },

      Question: {
          author: async (question, args, {models})=>{
              return await models.User.findById(question.author)
          }
      },

      Mutation: {
          createQuestion: combineResolvers (
              isAuthenticated, async (parent, {statement, category, type, level, answer, options, book}, {me, models}) => {
                  const question = await models.Question.create({
                      statement, category, type, level, answer, options, book, author: null,
                  });
                  return question;
              } 
          ),

          editQuestion: combineResolvers(isQuestionOwner, isAuthenticated, async (parent, {id, statement, category, type, level, answer, options, book}, {me, models}) => {

            const q = await models.Question.findById(id);

            if (!q){
                return false;
              }
              else {
                q.statement = statement;
                q.category = category;
                q.type = type;
                q.level = level;
                q.answer = answer;
                q.options = options;
                q.book = book;
                await q.save();
                return q;
              }              
                
            } ) 
        ,

          deleteQuestion: combineResolvers (isAuthenticated, isQuestionOwner, async (parent, {id}, {models})=>{
              const question = await models.Question.findById(id);

              if (!question){
                return false;
              }
              else {
                  await question.remove();
                  return true;
              }
          }),
      }
  }