import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import { Manager } from '../authority';
import initializeApolloClient from './initializeApolloClient';

const useApollo = (authorityManager: Manager, initialState?: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> => {
  const store = useMemo(() => initializeApolloClient(authorityManager, initialState), [authorityManager, initialState]);
  return store;
};

export default useApollo;
