import React from 'react';
import { Container } from '@chakra-ui/react';

const WideContent: React.FC = ({ children }) => (
  <Container p="0" maxW={['30em', '40em', '50em', '60em']}>
    {children}
  </Container>
);

const NarrowContent: React.FC = ({ children }) => (
  <Container p="0" maxW={['30em', '30em', '30em', '30em']}>
    {children}
  </Container>
);

export { WideContent, NarrowContent };
