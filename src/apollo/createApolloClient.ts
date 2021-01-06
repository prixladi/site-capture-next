import ws from 'ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getGraphqlConfig, isServer } from '../configs';
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import typePolicies from './typePolicies';
import { SubscriptionClient } from 'subscriptions-transport-ws';

type Apollo = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  subscriptionClient: SubscriptionClient;
};

// Stub client for server SSG
// If you want to use client on sever always initialize new instance with createApoloClient
const defaultServerClient = {
  apolloClient: new ApolloClient({
    ssrMode: true,
    uri: '/graphql',
    cache: new InMemoryCache(),
  }),
  subscriptionClient: new SubscriptionClient('/graphql', { lazy: true }, ws),
};

const createApolloClient = (getBearerToken: () => string | null): Apollo => {
  const config = getGraphqlConfig();
  if (!config.url) {
    throw new Error('Graphql endpoint url was not specified in config.');
  }

  const authLink = setContext((_, { headers }) => {
    const token = getBearerToken();

    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return { headers: {} };
  });

  const httpLink = new HttpLink({
    uri: config.url,
  });

  const subscriptionClient = new SubscriptionClient(
    config.wsUrl,
    {
      reconnect: true,
      lazy: true,
      timeout: 20000,
      connectionParams: () => {
        const token = getBearerToken();

        if (token) {
          return {
            Authorization: `Bearer ${token}`,
          };
        }

        return {};
      },
    },
    isServer ? ws : undefined,
  );

  const wsLink = new WebSocketLink(subscriptionClient);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const apolloClient = new ApolloClient({
    ssrMode: isServer, // set to true for SSR
    uri: config.url,
    link: splitLink,
    cache: new InMemoryCache({ typePolicies }),
  });

  return {
    apolloClient,
    subscriptionClient,
  };
};

export type { Apollo };
export { defaultServerClient };
export default createApolloClient;
