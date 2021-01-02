import { Flex, Skeleton, Icon, Button, Tag, Grid, Box, Text as ChakraText, Heading, Divider } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { NarrowContent } from '../components/Content';
import Text from '../components/Text';
import { useMeQuery } from '../graphql';
import withAuthentication from '../hoc/withAuthentication';
import { FaPlus } from 'react-icons/fa';
import ExternalLink from '../components/ExternalLink';
import { useRouter } from 'next/router';
import { SiteRoute } from '../routes';

const SkelletonComponent = () => (
  <>
    <Skeleton heigth="1em" />
    <Skeleton heigth="1em" />
    <Skeleton heigth="1em" />
    <Skeleton heigth="1em" />
  </>
);

const trimUrl = (url: string): string => {
  if (url.length < 50) {
    return url;
  }

  return `${url.substring(0, 47)}...`;
};

const trimName = (name: string): string => {
  if (name.length < 20) {
    return name;
  }

  return `${name.substring(0, 17)}...`;
};

const Sites: React.FC = () => {
  const { data, error } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.error('Error while fetching my user.', error);
    }
  }, [error]);

  if (!data) {
    return <SkelletonComponent />;
  }

  return (
    <NarrowContent>
      <Box mb="2em">
        <Heading as="h1" mb="0.5em">
          Sites
        </Heading>
        <Text>List of your predefined sites. Click on concerete site to show detail, edit or run capturing.</Text>
      </Box>
      <Grid gridGap="1.5em">
        {data.me.sites.map((site) => (
          <Grid
            onClick={async () => await router.push(SiteRoute(site.id))}
            opacity="0.8"
            _hover={{ cursor: 'pointer', opacity: '1' }}
            borderRadius="2em"
            key={site.id}
            gridGap="0.5em"
          >
            <Heading as="h2">{trimName(site.name)}</Heading>
            <Flex gridGap="0.5em">
              <Tag fontSize="0.8em" colorScheme="blue">
                {site.viewports.length} Viewports
              </Tag>
              <Tag fontSize="0.8em" colorScheme="yellow">
                {site.subsites.length} Subsites
              </Tag>
            </Flex>
            <ChakraText fontSize="1.2em" opacity="0.7" key={site.id}>
              <ExternalLink href={site.url}>{trimUrl(site.url)}</ExternalLink>
            </ChakraText>
            <Divider />
          </Grid>
        ))}

        <Button minW="8em" fontSize="1.3em" colorScheme="yellow">
          Add new site <Icon ml="0.2em" as={FaPlus} />
        </Button>
      </Grid>
    </NarrowContent>
  );
};

// This is here for Fast refresh to work as intended
// https://github.com/vercel/next.js/issues/13024
const AuthenticatedPage = withAuthentication(Sites, SkelletonComponent);
const SitesPage = () => <AuthenticatedPage />;

export default SitesPage;
