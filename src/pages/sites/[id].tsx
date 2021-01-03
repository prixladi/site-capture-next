import React, { useEffect, useState } from 'react';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
import Text from '../../components/Text';
import { useRunSiteJobMutation, useSiteLazyQuery, useUpdateSiteMutation } from '../../graphql';
import { WideContent } from '../../components/Content';
import DefaultSkeleton from '../../components/DefaultSkeleton';
import withAuthentication from '../../hoc/withAuthentication';
import useRouteId from '../../hooks/useRouteId';
import NotFound from '../404';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';
import { siteUpdatedNotification } from '../../services/notificationService';
import { JobProgress } from '../../components/jobProgress';
import useCompactLayout from '../../hooks/useCompactLayout';
import DeleteSiteButton from '../../components/sitePage/DeleteSiteButton';
import ExtractTemplateButton from '../../components/sitePage/ExtractTemplateButton';
import SiteForm, { Values } from '../../components/sitePage/SiteForm';

const Site: React.FC = () => {
  const [updateSite] = useUpdateSiteMutation();
  const [runSiteJob] = useRunSiteJobMutation();
  const [fetch, { data, error, loading }] = useSiteLazyQuery();

  const [id, invalid] = useRouteId();
  const [notFound, setNotFound] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [jobId, setJobId] = useState(null as string | null);
  const { handleGqlError } = useApolloErrorHandling(error);
  const isCompact = useCompactLayout();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (id) {
      fetch({ variables: { id } });
    }
  }, [id]);

  useEffect(() => {
    if (data && !data.me.site) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

  if (deleted) {
    return <DefaultSkeleton />;
  }

  if (notFound || invalid) {
    return <NotFound />;
  }

  if (!data || !data.me.site) {
    return <DefaultSkeleton />;
  }

  const onSubmitUpdate = async (values: Values) => {
    const transformedValues = {
      ...values,
      subsites: values.subsites ? values.subsites.map((sub) => sub.value) : [],
    };

    const { data, errors } = await updateSite({ variables: { id: id as string, update: transformedValues } });
    if (!data) {
      handleGqlError(errors);
    } else {
      siteUpdatedNotification();
    }

    return !!data;
  };

  const onSubmitUpdateAndCapture = async (values: Values) => {
    // update wasn't successful
    if (!(await onSubmitUpdate(values))) {
      return;
    }

    const { data, errors } = await runSiteJob({ variables: { id: id as string } });
    if (!data) {
      handleGqlError(errors);
      return;
    }

    if (!data.site.runJob.id) {
      console.error(`Error '${data.site.runJob.status}' while trying to run anonymouse job`);
      return;
    }

    window.scrollTo(0, document.body.scrollHeight);
    setJobId(data.site.runJob.id);
  };

  return (
    <WideContent>
      <Flex display={['grid', 'flex', 'flex', 'flex']} justifyContent="space-between" mb="2em">
        <Box maxW={['25em', '25em', '30em', '30em']} mb={isCompact ? '1em' : undefined}>
          <Heading as="h1" mb="0.5em">
            Site {data.me.site.name}
          </Heading>
          <Text>Update existing site or run capture job.</Text>
        </Box>
        <Grid gridGap="1.5em">
          <DeleteSiteButton siteId={id as string} setDeleted={setDeleted} />
          <ExtractTemplateButton site={data.me.site} />
        </Grid>
      </Flex>
      <SiteForm
        capturing={capturing}
        site={data.me.site}
        loading={loading}
        onSubmitUpdate={onSubmitUpdate}
        onSubmitUpdateAndCapture={onSubmitUpdateAndCapture}
        setJobId={setJobId}
      />
      {jobId && <JobProgress jobId={jobId} setLoading={setCapturing} />}
    </WideContent>
  );
};

// This is here for Fast refresh to work as intended
// https://github.com/vercel/next.js/issues/13024
const AuthenticatedPage = withAuthentication(Site, DefaultSkeleton);
const SitePage: React.FC = () => <AuthenticatedPage />;

export default SitePage;
