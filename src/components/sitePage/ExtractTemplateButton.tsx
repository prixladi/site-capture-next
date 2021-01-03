import { Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaMap } from 'react-icons/fa';
import { useAuthorityManager } from '../../authority';
import { SiteFieldsFragment, useCreateTemplateMutation } from '../../graphql';
import useApolloErrorHandling from '../../hooks/useApolloErrorHandling';
import { templateOnCreateUpdate } from '../../services/mutationService';
import { templateCreatedNotification } from '../../services/notificationService';

type Props = {
  site: SiteFieldsFragment;
};

const DeleteSiteButton: React.FC<Props> = ({ site }: Props) => {
  const [createTemplate, { error }] = useCreateTemplateMutation();

  const [loading, setLoading] = useState(false);
  const manager = useAuthorityManager();
  const { handleGqlError } = useApolloErrorHandling(error);

  const onExtractTemplate = async () => {
    setLoading(true);
    const { errors } = await createTemplate({
      variables: {
        template: {
          name: 't1',
          viewports: site.viewports.map((vp) => ({ width: vp.width, height: vp.height })),
          quality: site.quality,
        },
      },
      update: templateOnCreateUpdate(manager.getUserProfile()?.id),
    });

    if (errors) {
      handleGqlError(errors);
    } else {
      templateCreatedNotification();
    }

    setLoading(false);
  };

  return (
    <Button isLoading={loading} maxW="10em" onClick={onExtractTemplate} minW="8em" colorScheme="blue" fontSize="1.3em">
      <Icon mr="0.2em" as={FaMap} /> Extract template
    </Button>
  );
};

export default DeleteSiteButton;
