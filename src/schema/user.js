import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
    groups: [Group!]
    group(id: ID!): Group!
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
      key: String!
      role: String!
      url: String!
    ): Token!

    signIn(email: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
    updateUser(username: String!): User!
    initializeUserExamSolution(examId: ID!, userId: ID!): Boolean!
    finalizeUserExamSolution(examId: ID!, userId: ID!): Boolean!

    ######
    createGroup(name: String!, members: [String!]): Group!
    deleteGroup(id: ID!): Boolean!


    #######
   publishExamToGroup(examId: ID!, groupId: ID!): Boolean!
  
    }
  scalar Date

  type Token {
    token: String!
  }

  type User @key (fields: "id"){
    id: ID!
    username: String!
    group: [Group!]
    password: String!
    role: String
    email: String!
    exams: [Exam]
   # examSolutions: [ExamSolution]
    examSolutions: [Solution]
  }

  type Group @key (fields: "id"){
    id: ID!
    name: String!
    members: [User!]
  }

  type Solution {
    examSolution: ExamSolution
    status: String
  }

  extend type Exam @key(fields: "id") {
    id: ID! @external    
  }

  extend type ExamSolution @key(fields: "id") {
    id: ID! @external    
  }
`;