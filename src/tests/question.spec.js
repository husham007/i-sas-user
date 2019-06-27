import { expect } from 'chai';
import * as questionApi from './question-api';
import * as userApi from './user-api';

describe('questions', () => {
  describe('question(id: String!): Question', () => {
    it('returns a question when found', async () => {
      const expectedResult = {
        data: {
          question: {
            id: '5d074aaad0761d170b4aadba',            
            statement: 'What is programming',            
          },
        },
      };

      const result = await questionApi.question({ id: "5d074aaad0761d170b4aadba" });
      console.log('result...', result);
      
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('deleteQuestion(id: String!): Boolean!', () => {
    it('returns an error because only Question Owner can delete a Question', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await userApi.signIn({
        login: 'ddavids',
        password: 'ddavids',
      });

      const result = await questionApi.deleteQuestion({ id: '5d07818c90c18d6941ece493' }, token);
      console.log('result...', result.data.data.deleteQuestion);
      expect(result.data.data.deleteQuestion).to.be.true;
    });
  });


});
