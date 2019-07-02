import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import userTypeDefs from './schema/user';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import jwt from 'jsonwebtoken';
const { buildFederatedSchema } = require('@apollo/federation');
 

const app = express();
app.use(cors());



//const me = users[1];

const getMe = async req => {
  const token = req.headers['x-token'];
  console.log('tokennn length', token.length);
  if (token !== 'undefined') {
    try {
      console.log('in try ');
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      console.log(e);
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};





const server = new ApolloServer({
//schema: buildFederatedSchema([{ schema }]),
schema: buildFederatedSchema([{ typeDefs: userTypeDefs, resolvers }]),
 // typeDefs: schema,
//resolvers,
  introspection: true, // enables introspection of the schema
  playground: true, // enables the actual playground
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
      teacher: process.env.ROLE_TEACHER,
      student: process.env.ROLE_STUDENT,

    }
  }

});

server.applyMiddleware({
  app,
  path: '/graphql'
});

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 9000;

app.listen({ port }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

   

connectDb().then(async () => {
  if (isTest || isProduction) {
    // reset database 
    
    /*
    await Promise.all([
    models.User.deleteMany({}),
    models.Group.deleteMany({}),
    //models.Message.deleteMany({}),
    //models.Question.deleteMany({}),
    //models.QuestionBook.deleteMany({}),
    ]); 

    createUsersWithMessages(new Date());
*/
    
    console.log('DB connected'); 
  }   
}); 



const createUsersWithMessages = async date => {
  const user1 = new models.User({
    username: 'husham',
    email: 'husham.yousaf@integirfy,io',
    password: 'husham123',
    role: 'ADMIN',
  });



  const user2 = new models.User({
    username: 'masood2',
    email: 'masood2@integrify.io',
    password: 'masood123',
    role: 'STUDENT'
  });

  const user3 = new models.User({
    username: 'masood3',
    email: 'masood3@integrify.io',
    password: 'masood123',
    role: 'STUDENT',
  });

  const user4 = new models.User({
    username: 'masood4',
    email: 'masood4@integrify.io',
    password: 'masood123',
    role: 'STUDENT'
  });

  const group1 = new models.Group({
    name: "ADMIN",
    members: [user1],
  });

  const group2 = new models.Group({
    name: "STUDENT",
    members: [user2, user3, user4],
  });

  await group1.save();
  await group2.save();


  await user1.save();
  await user2.save();
  await user3.save(); 
  await user4.save(); 



 
/*
  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user1.id,
  });

  const message2 = new models.Message({
    text: 'Happy to release ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  const message3 = new models.Message({
    text: 'Published a complete ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  */

  

  /*
  await message1.save();
  await message2.save();
  await message3.save();
*/

/*
  await question1.save((err)=>{ 
    if (err) throw err;
  }); 


  await question2.save();
  await question3.save();
  await question4.save();
  await question5.save();
  
  await questionBookOne.save((err)=>{ 
    if (err) throw err;
  }); 
  await questionBookTwo.save((err)=>{ 
    if (err) throw err;
  }); 

  await user1.save();
  await user2.save(); 
  
 */
};

console.log('Hello Node.js project.');

console.log(process.env.SECRET);



