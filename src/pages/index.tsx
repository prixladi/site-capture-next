import React, { useEffect, useState } from 'react';
import { Box, Grid, Heading, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Text from '../components/Text';
import QualitySlider from '../components/QualitySlider';
import UrlInput from '../components/UrlInput';
import Button from '../components/Button';
import ViewportInputs, { Viewport } from '../components/ViewportInputs';
import { useRunAnonymousJobMutation } from '../graphql';
import InternalLink from '../components/InternalLink';
import { AuthRoute } from '../routes';
import JobProgress from '../components/JobProgress';
import { isServer } from '../configs';
import { FaCamera } from 'react-icons/fa';
import { WideContent } from '../components/Content';

type Values = {
  url: string;
  quality: number;
  viewports: Viewport[];
};

const tryLoadJobId = (): string | null => {
  if (!isServer) {
    return localStorage.getItem('anonymousJobId');
  }

  return null;
};

const saveJobId = (jobId: string, setJobId: (jobId: string) => void): void => {
  if (!isServer) {
    localStorage.setItem('anonymousJobId', jobId);
    setJobId(jobId);
  }
};

const saveValues = (values: Values): void => {
  if (!isServer) {
    localStorage.setItem('anonymousJobData', JSON.stringify(values));
  }
};

const tryLoadValues = (): Values | undefined => {
  if (!isServer) {
    const data = localStorage.getItem('anonymousJobData');
    return data ? (JSON.parse(data) as Values) : undefined;
  }

  return undefined;
};

const Index: React.FC = () => {
  const [runAnounymouJob] = useRunAnonymousJobMutation();
  const { handleSubmit, register, control, errors, getValues, setValue } = useForm<Values>();
  const [jobId, setJobId] = useState(tryLoadJobId());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const values = tryLoadValues();
    if (values) {
      if (values.url) {
        setValue('url', values.url);
      }
      if (values.quality) {
        setValue('quality', values.quality);
      }
      if (values.viewports) {
        setValue('viewports', values.viewports);
      }
    }
  }, [setValue, tryLoadValues]);

  const onSubmit = async (values: Values) => {
    const { data, errors } = await runAnounymouJob({ variables: { job: values } });
    if (!data || !data.runAnonymousJob) {
      console.log(errors);
      return;
    }

    if (!data.runAnonymousJob.id) {
      console.error(`Error '${data.runAnonymousJob.status}' while trying to run anonymouse job`);
      return;
    }

    window.scrollTo(0, document.body.scrollHeight);
    saveValues(getValues());
    saveJobId(data.runAnonymousJob.id, setJobId);
  };

  return (
    <WideContent>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          Site Capture
        </Heading>
        <Text>
          Create screenshots of a defined site with Site Capture. Use the demo below or <InternalLink href={AuthRoute}>log in</InternalLink>{' '}
          and try more advanced features such as templates and subsites.
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gridGap="1em">
          <UrlInput errorMessage={errors.url?.message} register={register} />
          <QualitySlider register={register} />
          <ViewportInputs errors={errors.viewports} register={register} control={control} />
          <Button submit isLoading={loading}>
            <Icon mr="0.2em" as={FaCamera} />
            Capture Site
          </Button>
        </Grid>
      </form>
      {jobId && <JobProgress jobId={jobId} setLoading={setLoading} />}
    </WideContent>
  );
};

export default Index;
