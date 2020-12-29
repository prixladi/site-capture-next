import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getGraphqlConfig, isServer } from '../configs';
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const config = getGraphqlConfig();
  if (!config.url) {
    throw new Error('Graphql endpoint url was not specified in config.');
  }

  return new ApolloClient({
    ssrMode: isServer, // set to true for SSR
    uri: config.url,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
