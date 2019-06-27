import { gql } from 'apollo-server-express';

export default gql `
extend type Query {
    questionBooks: [Book]!
    questionBookById(id: ID!): Book!
    questionBookByName(name: String!): Book!
}



type Book {
    book: String!
    categories: [String]!
    types: [String]!
    levels: [String]!
}



`;