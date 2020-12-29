import React, { Ref } from 'react';
import { Input, FormControl, FormLabel } from '@chakra-ui/react';
import { RegisterOptions } from 'react-hook-form';

type Props = {
  register: (rules?: RegisterOptions) => Ref<HTMLInputElement>;
};

const UrlInput: React.FC<Props> = ({ register }: Props) => (
  <FormControl id="url" isRequired>
    <FormLabel>Site Url</FormLabel>
    <Input placeholder="Url of the site to capture" type="url" name="url" ref={register({ required: true })} />
  </FormControl>
);

export default UrlInput;
