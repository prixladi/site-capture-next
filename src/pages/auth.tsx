import React, { useState } from 'react';
import { Collapse, Container } from '@chakra-ui/react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { Page } from '../components/auth/Shared';
import ForgottenPassword from '../components/auth/ForgottenPassword';

const Auth: React.FC = () => {
  const [page, setPage] = useState('Login' as Page);
  const goto = (newPage: Page) => setPage(newPage);

  return (
    <>
      <Container p="0" maxW={['30em', '30em', '30em', '30em']}>
        <Collapse animateOpacity in={page === 'Login'}>
          <Login goto={goto} />
        </Collapse>
        <Collapse animateOpacity in={page === 'Register'}>
          <Register goto={goto} />
        </Collapse>
        <Collapse animateOpacity in={page === 'ForgottenPassword'}>
          <ForgottenPassword goto={goto} />
        </Collapse>
      </Container>
    </>
  );
};

export default Auth;
