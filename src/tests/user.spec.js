import { expect } from 'chai';
import * as userApi from './user-api';

describe('users', () => {
 /* describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '5d074aaad0761d170b4aadb5',
            username: 'rwieruch',
            email: 'hello@robin.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await userApi.user({ id: '5d074aaad0761d170b4aadb5' });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
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

      const {
        data: { errors },
      } = await userApi.deleteUser({ id: '5d074aaad0761d170b4aadb6' }, token);

      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });
  */

  describe('signUp(username: String!, email: String!, password: String!): Token!', () => {
    it('returns an error if sign up not successful', async () => {
      
      const response = await userApi.signUp({
        username: 'husham17',
        email: 'husham.yousaf17@integrify.io',
        password: 'husham17',        
      });    
      
     const token = response.data.data ? response.data.data.signUp.token: null

      expect(token).to.be.a('string');
    });
  });


});