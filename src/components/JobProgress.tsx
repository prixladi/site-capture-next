import React, { useEffect } from 'react';
import { Box, Progress, Text, Link, Button, Flex, Icon } from '@chakra-ui/react';
import { useAnonymousJobQuery } from '../graphql';
import { getAnnonymousJobSubscriptionOptions } from '../services/subscriptionService';
import { FaCheck, FaTimes } from 'react-icons/fa';

type Props = {
  jobId: string;
  setLoading: (loading: boolean) => void;
};

type ErrorMessageProps = {
  errorMessage?: string | null;
};

type InfoMessageProps = {
  progress: number;
};

type DownloadButtonProps = {
  zipFileId?: string | null;
};

type ItemsProps = {
  items: {
    url: string;
    status: boolean;
    errorMessage?: string | null;
  }[];
};

const infoTextSize = ['1em', '1em', '1em', '1em'];

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }: ErrorMessageProps) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <Text mt="0.3em" fontWeight="500" color="red.500">
      {errorMessage}
    </Text>
  );
};

const InfoMessage: React.FC<InfoMessageProps> = ({ progress }: InfoMessageProps) => {
  if (progress >= 100) {
    return null;
  }

  return (
    <Text opacity="0.5" fontSize={infoTextSize}>
      This action may take a while, you can try to refresh page if action takes too long.
    </Text>
  );
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ zipFileId }: DownloadButtonProps) => {
  if (!zipFileId) {
    return null;
  }

  return (
    <Flex mt="1em" justifyContent="center">
      <Link isExternal download href={`http://localhost:8000/downloads/${zipFileId}`}>
        <Button>Download file</Button>{' '}
      </Link>
    </Flex>
  );
};

const Items: React.FC<ItemsProps> = ({ items }: ItemsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item) => {
        if (item.status) {
          return (
            <Text fontSize={infoTextSize} opacity="0.7" color="green.500" key={item.url}>
              {item.url} <Icon ml="0.2em" mr="0.2em" as={FaCheck} />{' '}
            </Text>
          );
        } else {
          return (
            <Text fontSize={infoTextSize} opacity="0.7" color="red.500" key={item.url}>
              {item.url} <Icon ml="0.2em" mr="0.2em" as={FaTimes} /> {item.errorMessage}{' '}
            </Text>
          );
        }
      })}
    </>
  );
};

const JobProgress: React.FC<Props> = ({ jobId, setLoading }: Props) => {
  const { loading, data, error, subscribeToMore } = useAnonymousJobQuery({ variables: { id: jobId }, errorPolicy: 'all' });

  useEffect(() => {
    const options = getAnnonymousJobSubscriptionOptions(jobId);
    const unsubscribe = subscribeToMore(options);
    return () => unsubscribe();
  }, [jobId, subscribeToMore]);

  useEffect(() => {
    const isLoading = loading || !!error || !data || !data.anonymousJob || data.anonymousJob.progress < 100;
    setLoading(isLoading);
  }, [loading, data, error]);

  if (!data) {
    return null;
  }

  if (!data.anonymousJob) {
    console.error('Error fetching anonymous job.', error);
    return null;
  }

  const { progress, errorMessage, items, zipFileId } = data.anonymousJob;
  const getColorScheme = () => {
    if (progress < 100) {
      return 'blue';
    }

    return errorMessage ? 'red' : 'green';
  };

  return (
    <Box pt="1em">
      <Text mb="0.3em" fontWeight="500" textAlign="center">
        {progress}%
      </Text>
      <Progress colorScheme={getColorScheme()} hasStripe={progress < 100} isAnimated={progress < 100} value={progress} />
      <InfoMessage progress={progress} />
      <ErrorMessage errorMessage={errorMessage} />
      <Items items={items} />
      <DownloadButton zipFileId={zipFileId} />
    </Box>
  );
};

export default JobProgress;
