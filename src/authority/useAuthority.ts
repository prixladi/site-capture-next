import { useMemo } from 'react';
import { Config } from './config';
import createManager, { Manager } from './manager';

const useAuthority = (config: Config): Manager => {
  const manager = useMemo(() => createManager(config), [config]);
  return manager;
};

export default useAuthority;
