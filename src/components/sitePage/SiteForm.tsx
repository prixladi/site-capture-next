import React, { useEffect } from 'react';
import { Flex, Grid, Icon } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import QualitySlider from '../QualitySlider';
import UrlInput from '../UrlInput';
import Button from '../Button';
import ViewportInputs, { Viewport } from '../ViewportInputs';
import { SiteFieldsFragment } from '../../graphql';
import { FaEdit } from 'react-icons/fa';
import NameInput from '../NameInput';
import SubsitesInput, { Subsite } from '../SubsitesInput';
import useCompactLayout from '../../hooks/useCompactLayout';

type Values = {
  url: string;
  name: string;
  quality: number;
  viewports: Viewport[];
  subsites: Subsite[];
};

type Props = {
  capturing: boolean;
  site: SiteFieldsFragment;
  loading: boolean;
  onSubmitUpdate: (values: Values) => Promise<unknown>;
  onSubmitUpdateAndCapture: (values: Values) => Promise<unknown>;
  setJobId: (value: string) => void;
};

const SiteForm: React.FC<Props> = ({ capturing, site, loading, setJobId, onSubmitUpdate, onSubmitUpdateAndCapture }: Props) => {
  const isCompact = useCompactLayout();
  const { handleSubmit, register, control, errors, formState, setValue, getValues } = useForm<Values>();

  useEffect(() => {
    const { name, url, quality, subsites, viewports, latestJobId } = site;

    setValue('name', name);
    setValue('url', url);
    setValue('quality', quality);
    setValue(
      'subsites',
      subsites.map((s) => ({ value: s })),
    );
    setValue('viewports', viewports);

    if (latestJobId) {
      setJobId(latestJobId);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmitUpdate)}>
      <Grid gridGap="1em">
        <NameInput errorMessage={errors.name?.message} register={register} />
        <UrlInput errorMessage={errors.url?.message} register={register} />
        <QualitySlider defaultQuality={site.quality} register={register} />
        <SubsitesInput errors={errors.subsites} register={register} control={control} />
        <ViewportInputs errors={errors.viewports} register={register} control={control} />
        <Flex display={isCompact ? 'grid' : 'flex'} justifyContent="center" gridGap="1.5em">
          <Button
            onClick={async () => {
              console.log('aaa');
            }}
            submit
            isLoading={formState.isSubmitting || loading || capturing}
          >
            <Icon mr="0.2em" as={FaEdit} />
            Update site
          </Button>
          <Button onClick={() => onSubmitUpdateAndCapture(getValues())} isLoading={formState.isSubmitting || loading || capturing}>
            <Icon mr="0.2em" as={FaEdit} />
            Update {'&'} Capture site
          </Button>
        </Flex>
      </Grid>
    </form>
  );
};

export type { Values };
export default SiteForm;
