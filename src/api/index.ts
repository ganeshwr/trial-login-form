// 3rd party
import { gql } from "@apollo/client";

// Mutation for login
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

// Mutation for refresh token
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;

// Query to get current logged in user's profile
export const MY_PROFILE_QUERY = gql`
  query {
    myProfile {
      id
      name
      avatar
    }
  }
`;
