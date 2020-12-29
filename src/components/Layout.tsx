import React from 'react';
import { Box, Container, Grid } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Navigation from './Navigation';
import Footer from './Footer';
import useSmallLayout from '../hooks/useSmallLayout';

const Layout: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const isSmallLayout = useSmallLayout();

  return (
    <Box position="relative" minH="100vh">
      <Grid pb={['4em', '5em', '6em', '6em']} gridGap="1em" templateColumns={['1fr', '1fr', '1fr', '3fr 1fr']}>
        {isSmallLayout && (
          <Container maxW={['30em', '40em', '50em', '60em']} marginTop={['1.5em']}>
            <Navigation />
          </Container>
        )}

        <Container maxW={['30em', '40em', '50em', '60em']} marginTop={['1em', '1em', '1em', '3em']}>
          <Component {...pageProps} />
        </Container>

        {!isSmallLayout && (
          <Container maxW={['30em', '40em', '50em', '60em']} marginTop={['1.5em']}>
            <Navigation />
          </Container>
        )}
      </Grid>

      <Box position="absolute" w="100%" h={['3em', '4em', '5em', '5em']} bottom="0">
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
