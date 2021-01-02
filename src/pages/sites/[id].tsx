import React, { useEffect, useState } from 'react';
import { Box, Grid, Heading, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Text from '../../components/Text';
import QualitySlider from '../../components/QualitySlider';
import UrlInput from '../../components/UrlInput';
import Button from '../../components/Button';
import ViewportInputs, { Viewport } from '../../components/ViewportInputs';
import { useSiteLazyQuery, useUpdateSiteMutation } from '../../graphql';
import { FaEdit } from 'react-icons/fa';
import { WideContent } from '../../components/Content';
import NameInput from '../../components/NameInput';
import SubsitesInput, { Subsite } from '../../components/SubsitesInput';
import DefaultSkeleton from '../../components/DefaultSkeleton';
import withAuthentication from '../../hoc/withAuthentication';
import useRouteId from '../../hooks/useRouteId';
import NotFound from '../404';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';
import { siteUpdatedNotification } from '../../services/notificationService';

type Values = {
  url: string;
  name: string;
  quality: number;
  viewports: Viewport[];
  subsites: Subsite[];
};

const Site: React.FC = () => {
  const [updateSite] = useUpdateSiteMutation();
  const [id, invalid] = useRouteId();
  const [notFound, setNotFound] = useState(false);
  const [fetch, { data, error, loading }] = useSiteLazyQuery();
  const { handleSubmit, register, control, errors, formState, setValue } = useForm<Values>();

  useApolloErrorHandling(error);

  useEffect(() => {
    if (id) {
      fetch({ variables: { id } });
    }
  }, [id]);

  useEffect(() => {
    if (data && data.me.site) {
      const { name, url, quality, subsites, viewports } = data.me.site;

      setValue('name', name);
      setValue('url', url);
      setValue('quality', quality);
      setValue(
        'subsites',
        subsites.map((s) => ({ value: s })),
      );
      setValue('viewports', viewports);
    }
  }, [data]);

  useEffect(() => {
    if (data && !data.me.site) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

  if (notFound || invalid) {
    return <NotFound />;
  }

  if (!data || !data.me.site) {
    return <DefaultSkeleton />;
  }

  const onSubmit = async (values: Values) => {
    const transformedValues = {
      ...values,
      subsites: values.subsites ? values.subsites.map((sub) => sub.value) : [],
    };

    const { data, errors } = await updateSite({ variables: { id: id as string, update: transformedValues } });
    if (!data) {
      console.error(errors);
    } else {
      siteUpdatedNotification();
    }
  };

  return (
    <WideContent>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          Site {data.me.site.name}
        </Heading>
        <Text>Update existing site or run capture job.</Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gridGap="1em">
          <NameInput errorMessage={errors.name?.message} register={register} />
          <UrlInput errorMessage={errors.url?.message} register={register} />
          <QualitySlider defaultQuality={data.me.site.quality} register={register} />
          <SubsitesInput errors={errors.subsites} register={register} control={control} />
          <ViewportInputs errors={errors.viewports} register={register} control={control} />
          {formState.isDirty ? (
            <Button submit isLoading={formState.isSubmitting || loading}>
              <Icon mr="0.2em" as={FaEdit} />
              Update site
            </Button>
          ) : (
            <Button submit isLoading={formState.isSubmitting || loading}>
              <Icon mr="0.2em" as={FaEdit} />
              Capture site
            </Button>
          )}
        </Grid>
      </form>
    </WideContent>
  );
};

// This is here for Fast refresh to work as intended
// https://github.com/vercel/next.js/issues/13024
const AuthenticatedPage = withAuthentication(Site, DefaultSkeleton);
const SitePage: React.FC = () => <AuthenticatedPage />;

export default SitePage;
