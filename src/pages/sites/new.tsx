import React from 'react';
import { Box, Grid, Heading, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Text from '../../components/Text';
import QualitySlider from '../../components/QualitySlider';
import UrlInput from '../../components/UrlInput';
import Button from '../../components/Button';
import ViewportInputs, { Viewport } from '../../components/ViewportInputs';
import { useCreateSiteMutation } from '../../graphql';
import { SiteRoute } from '../../routes';
import { FaPlus } from 'react-icons/fa';
import { WideContent } from '../../components/Content';
import { useRouter } from 'next/router';
import NameInput from '../../components/NameInput';
import SubsitesInput, { Subsite } from '../../components/SubsitesInput';
import DefaultSkeleton from '../../components/DefaultSkeleton';
import withAuthentication from '../../hoc/withAuthentication';
import { useAuthorityManager } from '../../authority';
import { siteOnCreateUpdate } from '../../services/mutationService';
import { apiServerErrorNotification, siteCreatedNotification } from '../../services/notificationService';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';

type Values = {
  url: string;
  name: string;
  quality: number;
  viewports: Viewport[];
  subsites: Subsite[];
};

const NewSite: React.FC = () => {
  const [createSite, { error }] = useCreateSiteMutation();

  const manager = useAuthorityManager();
  const router = useRouter();
  const { handleGqlError } = useApolloErrorHandling(error);

  const { handleSubmit, register, control, errors, formState } = useForm<Values>();

  const onSubmit = async (values: Values) => {
    const transformedValues = {
      ...values,
      subsites: values.subsites ? values.subsites.map((sub) => sub.value) : [],
    };

    const { data, errors } = await createSite({
      variables: { site: transformedValues },
      update: siteOnCreateUpdate(manager.getUserProfile()?.id),
    });

    if (!data) {
      handleGqlError(errors);
      return;
    }

    siteCreatedNotification();
    await router.push(SiteRoute(data.site.create.id));
  };

  return (
    <WideContent>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          New Site
        </Heading>
        <Text>Create new site that you can later reuse.</Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gridGap="1em">
          <NameInput errorMessage={errors.name?.message} register={register} />
          <UrlInput errorMessage={errors.url?.message} register={register} />
          <QualitySlider register={register} />
          <SubsitesInput errors={errors.subsites} register={register} control={control} />
          <ViewportInputs errors={errors.viewports} register={register} control={control} />
          <Button submit isLoading={formState.isSubmitting}>
            <Icon mr="0.2em" as={FaPlus} />
            Create site
          </Button>
        </Grid>
      </form>
    </WideContent>
  );
};

// This is here for Fast refresh to work as intended
// https://github.com/vercel/next.js/issues/13024
const AuthenticatedPage = withAuthentication(NewSite, DefaultSkeleton);
const NewSitePage: React.FC = () => <AuthenticatedPage />;

export default NewSitePage;
