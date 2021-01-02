import { ApolloClient, useApolloClient } from '@apollo/client';
import { NextRouter, useRouter } from 'next/router';
import { Manager, useAuthorityManager } from '../authority';

type Essentials = {
  router: NextRouter;
  authManager: Manager;
  apollo: ApolloClient<unknown>;
};

const useEssentials = (): Essentials => {
  const router = useRouter();
  const authManager = useAuthorityManager();
  const apollo = useApolloClient();

  return { router, authManager, apollo };
};

export default useEssentials;
