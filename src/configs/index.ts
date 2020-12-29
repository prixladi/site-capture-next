import getGraphqlConfig from './graphqlConfig';
import { isServer } from './shared';

declare global {
  interface Window {
    config: {
      graphqlUrl: string;
    };
  }
}

export { isServer };
export { getGraphqlConfig };
