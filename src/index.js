import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import jwt from 'jsonwebtoken';

 

const app = express();
app.use(cors());



//const me = users[1];

const getMe = async req => {
  const token = req.headers['x-token'];
  //console.log('token', token);
  if (token) {
    try {
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

  typeDefs: schema,
  resolvers,
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
    models.Message.deleteMany({}),
    models.Question.deleteMany({}),
    models.QuestionBook.deleteMany({}),
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
    username: 'masood',
    email: 'masood@integrify.io',
    password: 'masood123',
  });



 
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

  

  const question1 = new models.Question({
    statement: 'What is programming',   
    category: 'general',
    type: 'Short',
    level: 'Easy',
    answer: 'answer',
    options: ['a', 'b', 'c', 'd'],
    author: user2.id,
    book: 'javascript',
    createdAt: date.setSeconds(date.getSeconds() + 1),    
  });


  const question2 = new models.Question({
    statement: 'What are promises',   
    category: 'Promises',
    type: 'Long',
    level: 'Advance',
    answer: 'answer',
    options: ['i', 'j', 'k', 'l'],
    author: user2.id,
    book: 'javascript',
    createdAt: date.setSeconds(date.getSeconds() + 1),    
  });

  const question3 = new models.Question({
    statement: 'What are Functions',   
    category: 'Functions',
    type: 'Short',
    level: 'Intermediate',
    answer: 'answer',
    options: ['i', 'j', 'k', 'l'],
    author: user2.id,
    book: 'javascript',
    createdAt: date.setSeconds(date.getSeconds() + 1),    
  });

  const question4 = new models.Question({
    statement: 'What is arrays',   
    category: 'Arrays',
    type: 'True/False',
    level: 'Advance',
    answer: 'answer',
    options: ['i', 'j', 'k', 'l'],
    author: user2.id,
    book: 'javascript',
    createdAt: date.setSeconds(date.getSeconds() + 1),    
  });

  const question5 = new models.Question({
    statement: 'Reverse Array of Strings',   
    category: 'Arrays',
    type: 'Programming',
    level: 'Hard',
    answer: 'answer',
    options: ['i', 'j', 'k', 'l'],
    author: user2.id,
    book: 'javascript',
    createdAt: date.setSeconds(date.getSeconds() + 1),    
  });

  const questionBookOne = new models.QuestionBook({
    book: 'javascript',
    categories: ['General', 'Loops', 'Arrays', 'Functions', 'Promises'],
    types: ['MCQ', 'True/False', 'Programming', 'Short', 'Long', 'Find Bug(s)'],
    levels: ['Easy', 'Intermediate', 'Hard', 'Advance']
  });

  const questionBookTwo = new models.QuestionBook({
    book: 'python',
    categories: ['General', 'Loops', 'Arrays', 'Functions', 'Promises'],
    types: ['MCQ', 'True/False', 'Programming', 'Short', 'Long', 'Find Bug(s)'],
    levels: ['Easy', 'Intermediate', 'Hard', 'Advance']
  });

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



