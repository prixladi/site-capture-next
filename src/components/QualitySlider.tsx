import React, { Ref, useState } from 'react';
import { Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, FormControl, FormLabel } from '@chakra-ui/react';
import { RegisterOptions } from 'react-hook-form';

type Props = {
  register: (rules?: RegisterOptions) => Ref<HTMLInputElement>;
  defaultQuality?: number;
};

const _defaultQuality = 100;

const QualitySlider: React.FC<Props> = ({ register, defaultQuality }: Props) => {
  const [value, setValue] = useState(defaultQuality ?? _defaultQuality);

  return (
    <FormControl id="quality" isRequired>
      <FormLabel>Image quality</FormLabel>
      <Slider
        onChange={(num) => setValue(num)}
        name="quality"
        aria-label="slider-ex-1"
        defaultValue={defaultQuality ?? _defaultQuality}
        min={1}
        max={100}
        ref={register({ required: true, setValueAs: parseInt })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text fontWeight="500" textAlign="center">
        {value}
      </Text>
    </FormControl>
  );
};

export default QualitySlider;
