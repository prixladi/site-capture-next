import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

const send = (options: UseToastOptions) => {
  const toast = createStandaloneToast();
  toast(options);
};

const authServerErrorNotification = (): void => {
  send({ description: 'Authorization server returned error response.', status: 'error' });
};

const apiServerErrorNotification = (): void => {
  send({ description: 'Aplication server returned error response.', status: 'error' });
};

const registeredNotification = (): void => {
  send({ description: 'Successfuly registered.', status: 'success' });
};

const loggedInNotification = (): void => {
  send({ description: 'Successfuly signed in.', status: 'success' });
};

const loggedOutNotification = (): void => {
  send({ description: 'Successfuly signed out.', status: 'info' });
};

const loginExpiredNotification = (): void => {
  send({ description: 'You session expired please sign in again.', status: 'info' });
};

const loginNeededNotification = (): void => {
  send({ description: 'You need to sign in first.', status: 'info' });
};

const forgottenPasswordSentNotification = (): void => {
  send({ description: 'Forgotten password reset has been sent to your email.', status: 'success' });
};

export {
  authServerErrorNotification,
  apiServerErrorNotification,
  loggedInNotification,
  loggedOutNotification,
  loginExpiredNotification,
  loginNeededNotification,
  registeredNotification,
  forgottenPasswordSentNotification,
};
