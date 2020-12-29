import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

type Props = {
  value: React.ReactNode;
};

const SubmitButton: React.FC<Props> = ({ value }: Props) => (
  <Flex justifyContent="center">
    <Button type="submit" colorScheme="yellow">
      {value}
    </Button>
  </Flex>
);

export default SubmitButton;
