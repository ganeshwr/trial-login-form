// React built-in
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Components
import App from "./App.tsx";

// 3rd party
import { ApolloProvider } from "@apollo/client";

// Helper & misc
import "./index.css";
import "./i18n";
import client from "./apolloClient";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
