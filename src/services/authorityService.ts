import { NextRouter } from 'next/dist/client/router';
import { Callbacks } from '../authority';
import { HomeRoute, AuthRoute } from '../routes';
import { authServerErrorNotification, loggedInNotification, loggedOutNotification } from './notificationService';

const defaultCallbacks = (router: NextRouter): Callbacks => ({
  onError: async (err) => {
    authServerErrorNotification();
    console.error(err);
  },
  onUnauthorized: async () => {
    loggedOutNotification();
    await router.push(AuthRoute);
  },
});

const onSignIn = async (router: NextRouter): Promise<void> => {
  loggedInNotification();
  await router.push(HomeRoute);
};

export { defaultCallbacks, onSignIn };
