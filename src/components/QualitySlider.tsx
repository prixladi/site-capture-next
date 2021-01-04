import React, { Ref, useEffect, useState } from 'react';
import { Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, FormControl, FormLabel } from '@chakra-ui/react';
import { RegisterOptions } from 'react-hook-form';

type Props = {
  register: (rules?: RegisterOptions) => Ref<HTMLInputElement>;
  defaultQuality?: number;
  quality?: number | null;
};

const _defaultQuality = 100;

const QualitySlider: React.FC<Props> = ({ register, defaultQuality, quality }: Props) => {
  const [value, setValue] = useState(defaultQuality ?? _defaultQuality);
  //const {actions, state} = useSlider({min: 1, max: 100, value: value });

  useEffect(() => {
    if (quality) {
      setValue(quality);
    }
  }, [quality, setValue]);

  return (
    <FormControl id="quality" isRequired>
      <FormLabel>Image quality</FormLabel>
      <Slider
        onChange={(num) => setValue(num)}
        name="quality"
        aria-label="slider-ex-1"
        defaultValue={defaultQuality ?? _defaultQuality}
        value={value}
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
