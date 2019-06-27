import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const question = async variables => 
    axios.post(API_URL, {
        query: `
      query ($id: ID!) {
        question(id: $id) {
          id
          statement
        }
      }
    `,
        variables,
    });




export const deleteQuestion = async (variables, token) =>
    axios.post(
        API_URL,
        {
            query: `
        mutation ($id: ID!) {
          deleteQuestion(id: $id)
        }
      `,
            variables,
        },
        {
            headers: {
                'x-token': token,
            },
        },
    );

