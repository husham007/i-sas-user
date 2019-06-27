import mongoose from 'mongoose';
import User from './user';
import Message from './message';
import Question from './question';
import QuestionBook from './questionBook';
import Group from './group'


const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    console.log(process.env.TEST_DATABASE_URL);
    return mongoose.connect(
      process.env.TEST_DATABASE_URL,
      { useNewUrlParser: true },
    );
  }

  if (process.env.DATABASE_URL) {
    
    
    return mongoose.connect(
      process.env.DATABASE_URL,
      { useNewUrlParser: true },
    );
  }
};



let users = {
    1: {
      id: '1',
      username: 'Muhammad Husham Yousaf',
      school: 'INTEGRIFY',
      messageIds: [1],
    },
    2: {
      id: '2',
      username: 'Aylin',
      school: 'None',
      messageIds: [2],
    },
  };
  
  let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
  }; 

  export { connectDb };
  const models = {User, Group};

  export default models;