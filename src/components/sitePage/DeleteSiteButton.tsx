import { Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useAuthorityManager } from '../../authority';
import { useDeleteSiteMutation } from '../../graphql';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';
import { SitesRoute } from '../../routes';
import { siteOnDeleteUpdate } from '../../services/mutationService';
import { siteDeletedNotification } from '../../services/notificationService';

type Props = {
  siteId: string;
  setDeleted: (value: boolean) => void;
};

const DeleteSiteButton: React.FC<Props> = ({ siteId, setDeleted }: Props) => {
  const [deleteSite, { error }] = useDeleteSiteMutation();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const manager = useAuthorityManager();
  const { handleGqlError } = useApolloErrorHandling(error);

  const onDelete = async () => {
    setLoading(true);
    setDeleted(true);
    const { errors } = await deleteSite({
      variables: { id: siteId },
      update: siteOnDeleteUpdate(manager.getUserProfile()?.id),
    });

    if (errors) {
      handleGqlError(errors);
      setDeleted(false);
      return;
    }

    setLoading(false);
    siteDeletedNotification();
    await router.push(SitesRoute);
  };

  return (
    <Button isLoading={loading} onClick={onDelete} maxW="10em" minW="8em" colorScheme="blue" fontSize="1.3em">
      <Icon mr="0.2em" as={FaTrash} /> Delete Site
    </Button>
  );
};

export default DeleteSiteButton;
