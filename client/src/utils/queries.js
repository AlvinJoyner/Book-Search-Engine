import { gql } from '@apollo/client';

// Define a fragment for common book fields
const BOOK_FRAGMENT = gql`
  fragment BookInfo on Book {
    bookId
    authors
    image
    description
    title
    link
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        ...BookInfo
      }
    }
  } 
  
  ${BOOK_FRAGMENT} 
  `;
