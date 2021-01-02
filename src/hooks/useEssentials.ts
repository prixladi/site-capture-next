import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useAuthorityManager } from '../authority';

const useEssentials = () => {
  const router = useRouter();
  const authManager = useAuthorityManager();
  const apollo = useApolloClient();

  return { router, authManager, apollo };
};

export default useEssentials;