import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthorityManager } from '../authority';
import { signOut } from '../services/authorityService';

const Logout = () => {
  const router = useRouter();
  const manager = useAuthorityManager();
  const apollo = useApolloClient();

  useEffect(() => {
    signOut(manager, router, apollo);
  }, []);

  return null;
};

export default Logout;
