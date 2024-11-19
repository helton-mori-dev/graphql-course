import { createApp, h, provide } from "vue";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client/core";
import gql from "graphql-tag";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { WebSocketLink } from "@apollo/client/link/ws";
import typeDefs from "./graphql/typedefs.gql";
import FAVORITE_BOOKS_QUERY from "./graphql/favoriteBooks.gql";

import App from "./App.vue";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();

cache.writeQuery({
  query: FAVORITE_BOOKS_QUERY,
  data: {
    favoriteBooks: [
      {
        __typename: "Book",
        title: "My book",
        id: 234,
        rating: 5,
      },
    ],
  },
});

const apolloClient = new ApolloClient({
  link,
  cache,
  typeDefs,
});

const ALL_BOOKS_QUERY = gql`
  query AllBooks {
    allBooks {
      id
      title
      rating
    }
  }
`;

// apolloClient
//   .query({
//     query: ALL_BOOKS_QUERY,
//   })
//   .then((res) => {
//     console.log(res);
//   });

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.mount("#app");
