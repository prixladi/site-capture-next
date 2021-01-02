import { ApolloError } from '@apollo/client';
import { useEffect } from 'react';

const useApolloErrorHandling = (error?: ApolloError): void => {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);
};

export default useApolloErrorHandling;
