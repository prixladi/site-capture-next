import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import useApollo from '../apollo/useApollo';
import Layout from '../components/Layout';

const App: React.FC<AppProps> = (props: AppProps): JSX.Element => {
  const apollo = useApollo(props.pageProps.initialApolloState);

  return (
    <>
      <Head>
        <title>Site Capture</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/config.js"></script>
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ApolloProvider client={apollo}>
          <Layout {...props} />
        </ApolloProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
