import { gql } from 'apollo-server-express';

export default gql `
extend type Query {
    # Fetches Question pages
    # Each page have Questions and pageInfo
    # pageInfo has hasNextPage boolean and cursor for next page
    questions(cursor: String, limit: Int): QuestionPages!
    
    # Fetches a Question Object given its ID.
    question(id: ID!): Question!
    searchQuestion (searchInput: SearchInput!): [Question]
}

extend type Mutation {
    createQuestion(statement: String!, category: String!, type: String!, level: String!, answer: String!, options: [String]! book: String!): Question!
    editQuestion(id: ID!, statement: String!, category: String!, type: String!, level: String!, answer: String!, options: [String]! book: String!): Question!
    deleteQuestion(id: ID!): Boolean!
    
}

type QuestionPages {
    page: [Question!]!
    pageInfo: PageInformation! 
}

type PageInformation {
    hasNextPage : Boolean!
    endCursor: String!
}

type Question {
    id: ID!
    statement: String!
    category: String!
    type: String!
    level: String!
    answer: String!
    option: [String]!
    author: User
    book: String!
}

input SearchInput {
    statement: String
    category: String
    type: String
    level: String
    answer: String
    option: [String]   
    book: String
}
`;