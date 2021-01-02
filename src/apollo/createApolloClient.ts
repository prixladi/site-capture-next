import ws from 'ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getGraphqlConfig, isServer } from '../configs';
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

const createApolloClient = (getBearerToken: () => string | null): ApolloClient<NormalizedCacheObject> => {
  const config = getGraphqlConfig();
  if (!config.url) {
    throw new Error('Graphql endpoint url was not specified in config.');
  }

  const authLink = setContext((_, { headers }) => {
    const token = getBearerToken();

    return token
      ? {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        }
      : { headers: {} };
  });

  const httpLink = new HttpLink({
    uri: config.url,
  });

  const wsLink = new WebSocketLink({
    uri: config.wsUrl,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => {
        const token = getBearerToken();

        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    },
    webSocketImpl: isServer ? ws : undefined,
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  return new ApolloClient({
    ssrMode: isServer, // set to true for SSR
    uri: config.url,
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
