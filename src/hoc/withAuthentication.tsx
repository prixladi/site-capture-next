import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEssentials from '../hooks/useEssentials';
import { defaultCallbacks, onLoginExpired } from '../services/authorityService';

const withAuthentication = <TProps extends object>(Component: React.FC<TProps>, Skeleton: React.FC) => {
  return (props: TProps) => {
    const [skeleton, setSkeleton] = useState(true);
    const { router, authManager, apollo } = useEssentials();
    const isMounted = useRef(false);

    const handleProfile = useCallback(async () => {
      const profile = authManager.getUserProfile();
      if (profile && profile.tokenExpire > Math.floor(Date.now() / 1000) + 120 /*2 minute skw*/) {
        setSkeleton(false);
        return;
      }

      if (await authManager.refreshToken(defaultCallbacks(router))) {
        if (isMounted.current) {
          setSkeleton(false);
        }
      } else {
        onLoginExpired(authManager, router, apollo);
      }
    }, [router, authManager, setSkeleton]);

    useEffect(() => {
      isMounted.current = true;
      handleProfile();
      return () => {
        isMounted.current = false;
      };
    }, [handleProfile]);

    if (skeleton) {
      return <Skeleton />;
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
