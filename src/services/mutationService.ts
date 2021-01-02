import { MutationUpdaterFn } from '@apollo/client';
import {
  CreateSiteMutation,
  CreateTemplateMutation,
  MeDocument,
  MeQuery,
  SiteDocument,
  SiteQuery,
  TemplateDocument,
  TemplateQuery,
} from '../graphql';

const siteOnCreateUpdate = (userId?: string): MutationUpdaterFn<CreateSiteMutation> => (cache, result) => {
  if (result.data) {
    const oldMe = cache.readQuery<MeQuery>({ query: MeDocument });
    if (oldMe) {
      const newMe = {
        ...oldMe,
        me: {
          ...oldMe.me,
          sites: [...oldMe.me.sites, result.data.site.create],
        },
      };

      cache.writeQuery<MeQuery>({ query: MeDocument, data: newMe });
    }

    if (userId) {
      const newData: SiteQuery = {
        __typename: 'Query',
        me: {
          id: userId as string,
          __typename: 'Me',
          site: {
            ...result.data.site.create,
            __typename: 'Site',
          },
        },
      };
      cache.writeQuery<SiteQuery>({
        query: SiteDocument,
        variables: { id: result.data.site.create.id },
        data: newData,
      });
    }
  }
};

const templateOnCreateUpdate = (userId?: string): MutationUpdaterFn<CreateTemplateMutation> => (cache, result) => {
  if (result.data) {
    const oldMe = cache.readQuery<MeQuery>({ query: MeDocument });
    if (oldMe) {
      const newMe = {
        ...oldMe,
        me: {
          ...oldMe.me,
          templates: [...oldMe.me.templates, result.data.template.create],
        },
      };

      cache.writeQuery<MeQuery>({ query: MeDocument, data: newMe });
    }

    if (userId) {
      const newData: TemplateQuery = {
        __typename: 'Query',
        me: {
          id: userId as string,
          __typename: 'Me',
          template: {
            ...result.data.template.create,
            __typename: 'Template',
          },
        },
      };
      cache.writeQuery<TemplateQuery>({
        query: TemplateDocument,
        variables: { id: result.data.template.create.id },
        data: newData,
      });
    }
  }
};

export { siteOnCreateUpdate, templateOnCreateUpdate };
