import React, { useEffect, useState } from 'react';
import { Box, Grid, Heading, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Text from '../../components/Text';
import QualitySlider from '../../components/QualitySlider';
import Button from '../../components/Button';
import ViewportInputs, { Viewport } from '../../components/ViewportInputs';
import { useTemplateLazyQuery, useUpdateTemplateMutation } from '../../graphql';
import { FaEdit } from 'react-icons/fa';
import { WideContent } from '../../components/Content';
import NameInput from '../../components/NameInput';
import DefaultSkeleton from '../../components/DefaultSkeleton';
import withAuthentication from '../../hoc/withAuthentication';
import useRouteId from '../../hooks/useRouteId';
import NotFound from '../404';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';
import { templateUpdatedNotification } from '../../services/notificationService';

type Values = {
  name: string;
  quality: number;
  viewports: Viewport[];
};

const Template: React.FC = () => {
  const [updateSite] = useUpdateTemplateMutation();
  const [fetch, { data, error, loading }] = useTemplateLazyQuery();

  const [id, invalid] = useRouteId();
  const [notFound, setNotFound] = useState(false);
  const { handleGqlError } = useApolloErrorHandling(error);

  const { handleSubmit, register, control, errors, formState, setValue } = useForm<Values>();

  useEffect(() => {
    if (id) {
      fetch({ variables: { id } });
    }
  }, [id]);

  useEffect(() => {
    if (data && data.me.template) {
      const { name, quality, viewports } = data.me.template;

      setValue('name', name);
      setValue('quality', quality);
      setValue('viewports', viewports);
    }
  }, [data]);

  useEffect(() => {
    if (data && !data.me.template) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

  if (notFound || invalid) {
    return <NotFound />;
  }

  if (!data || !data.me.template) {
    return <DefaultSkeleton />;
  }

  const onSubmit = async (values: Values) => {
    const { data, errors } = await updateSite({ variables: { id: id as string, update: values } });

    if (!data) {
      handleGqlError(errors);
      return;
    }

    templateUpdatedNotification();
  };

  return (
    <WideContent>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          Template {data.me.template.name}
        </Heading>
        <Text>Update existing template.</Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gridGap="1em">
          <NameInput errorMessage={errors.name?.message} register={register} />
          <QualitySlider defaultQuality={data.me.template.quality} register={register} />
          <ViewportInputs errors={errors.viewports} register={register} control={control} />
          <Button submit isLoading={formState.isSubmitting || loading}>
            <Icon mr="0.2em" as={FaEdit} />
            Update template
          </Button>
        </Grid>
      </form>
    </WideContent>
  );
};

// This is here for Fast refresh to work as intended
// https://github.com/vercel/next.js/issues/13024
const AuthenticatedPage = withAuthentication(Template, DefaultSkeleton);
const TemplatePage: React.FC = () => <AuthenticatedPage />;

export default TemplatePage;
