import { useBreakpointValue } from '@chakra-ui/react';

const useSmallLayout = (): boolean => {
  const isSmallLayout = useBreakpointValue([true, true, true, false]) ?? true;
  return isSmallLayout;
};

export default useSmallLayout;
