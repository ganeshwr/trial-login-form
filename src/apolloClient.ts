// 3rd party
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";

// Helper & misc
import ls from "./utils/secureLs";
import { isTokenExpired } from "./utils/token";
import { Token } from "./types/Token";
import { REFRESH_TOKEN_MUTATION } from "./api";

const httpLink = new HttpLink({
  uri: "https://api.escuelajs.co/graphql",
});

// Create a middleware to add the token to headers
const authLink = new ApolloLink((operation, forward) => {
  const token: Token | undefined = ls.get("token");

  // Skip token refresh for login
  if (operation.operationName === "Login") {
    return forward(operation);
  }

  if (!token) {
    throw new Error("User is not authenticated");
  }

  // Check if the access token is expired
  if (
    isTokenExpired(token.access_token) &&
    !isTokenExpired(token.refresh_token)
  ) {
    return new Observable((observer) => {
      client
        .mutate({
          mutation: REFRESH_TOKEN_MUTATION,
          variables: { refreshToken: token.refresh_token },
        })
        .then(({ data }) => {
          const newAccessToken = data?.refreshToken?.access_token;
          const newRefreshToken = data?.refreshToken?.refresh_token;

          // Store the new tokens in secure local storage
          if (newAccessToken && newRefreshToken) {
            ls.set("token", {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            });

            // Retry the original request with the new access token
            operation.setContext({
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            // Call the forward function to execute the original request
            forward(operation).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error),
              complete: () => observer.complete(),
            });
          } else {
            throw new Error("Failed to refresh token");
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  operation.setContext({
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
