import React from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import QualitySlider from '../components/QualitySlider';
import UrlInput from '../components/UrlInput';
import SubmitButton from '../components/SubmitButton';
import ViewportInputs, { Viewport } from '../components/ViewportInputs';
import { useRunAnonymousJobMutation } from '../graphql';
import Text from '../components/Text';
import InternalLink from '../components/InternalLink';
import { LoginRute } from '../routes';

type Values = {
  url: string;
  quality: number;
  viewports: Viewport[];
};

const Index: React.FC = () => {
  const [run] = useRunAnonymousJobMutation();
  const { handleSubmit, register, control } = useForm<Values>();
  const onSubmit = (values: Values) => {
    console.log(JSON.stringify(values));
    run({ variables: { job: values } });
  };

  return (
    <>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          Site Capture
        </Heading>
        <Text>
          Create screenshots of a defined site with Site Capture. Use the demo below or <InternalLink href={LoginRute}>log in</InternalLink>{' '}
          and try more advanced features such as templates and subsites. Capturing screenshots may take a while especially when servers are
          busy. Request spamming may lead to an IP ban.
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gridGap="1em">
          <UrlInput register={register} />
          <QualitySlider register={register} />
          <ViewportInputs register={register} control={control} />
          <SubmitButton value="Capture Site" />
        </Grid>
      </form>
    </>
  );
};

export default Index;
