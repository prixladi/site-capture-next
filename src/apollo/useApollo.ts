import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import initializeApolloClient from './initializeApolloClient';

const useApollo = (initialState?: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> => {
  const store = useMemo(() => initializeApolloClient(initialState), [initialState]);
  return store;
};

export default useApollo;
