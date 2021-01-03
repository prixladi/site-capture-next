import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';
import { Manager } from '../authority';
import { isServer } from '../configs';
import createApolloClient from './createApolloClient';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

// Stub client for server SSG
// If you want to use client on sever always initialize new instance with createApoloClient
const serverClient = new ApolloClient({
  ssrMode: true,
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const initializeApolloClient = (authorityManager: Manager, initialState?: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> => {
  if (isServer) {
    return serverClient;
  }

  const _apolloClient =
    apolloClient ??
    createApolloClient(() => {
      const tokens = authorityManager.getTokens();
      return tokens.bearerToken;
    });

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }
  return _apolloClient;
};

export default initializeApolloClient;
