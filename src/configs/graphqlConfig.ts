import { isServer } from './shared';

type Config = {
  url: string;
};

const getConfig = (): Config => ({
  url: isServer ? (process.env.GRAPHQL_URL as string) : window.config.graphqlUrl,
});

export default getConfig;
