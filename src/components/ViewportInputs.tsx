import React, { Ref, useEffect } from 'react';
import { Input, FormControl, FormLabel, Flex, Grid, IconButton } from '@chakra-ui/react';
import { Control, RegisterOptions, useFieldArray } from 'react-hook-form';
import { FaPlus, FaMinus } from 'react-icons/fa';

export type Viewport = {
  width: number;
  height: number;
};

type InputProps = {
  register: (rules?: RegisterOptions) => Ref<HTMLInputElement>;
  viewport: Partial<Viewport>;
  remove: (index: number) => void;
  index: number;
  totalLen: number;
};

type Props = {
  register: (rules?: RegisterOptions) => Ref<HTMLInputElement>;
  control: Control;
};

const dimensionRules: RegisterOptions = { min: 300, max: 10000, required: true, setValueAs: parseInt };

const ViewportInput: React.FC<InputProps> = ({ register, viewport, remove, index, totalLen }: InputProps) => {
  const widthId = `viewports[${index}].width`;
  const heigthId = `viewports[${index}].height`;

  return (
    <Flex key={`viewports[${index}]`} gridGap="1em" width="100%">
      <Input placeholder="Width" id={widthId} type="number" name={widthId} ref={register(dimensionRules)} />
      <Input placeholder="Height" id={heigthId} type="number" name={heigthId} ref={register(dimensionRules)} />
      {totalLen > 1 && (
        <IconButton
          onClick={() => remove(index)}
          background="transparent"
          _hover={{ background: 'transparent' }}
          aria-label="remove-button"
          as={FaMinus}
          fontSize="2em"
          color="red.500"
        />
      )}
    </Flex>
  );
};

const ViewPortInputs: React.FC<Props> = ({ register, control }: Props) => {
  const { fields, append, remove } = useFieldArray<Viewport>({
    control,
    name: 'viewports',
  });

  useEffect(() => {
    append({});
  }, []);

  return (
    <FormControl isRequired>
      <FormLabel>Viewports (width, height)</FormLabel>
      <Grid gridGap="1em">
        {fields.map((viewport: Partial<Viewport & { id: string | number | null | undefined }>, index: number) => (
          <ViewportInput key={viewport.id} remove={remove} register={register} viewport={viewport} index={index} totalLen={fields.length} />
        ))}
      </Grid>
      <Flex justifyContent="center" mt="1em">
        <IconButton
          onClick={() => append({})}
          background="transparent"
          _hover={{ background: 'transparent' }}
          aria-label="add-button"
          as={FaPlus}
          fontSize="2em"
          color="green.500"
        />
      </Flex>
    </FormControl>
  );
};

export default ViewPortInputs;
