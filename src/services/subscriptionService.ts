import { SubscribeToMoreOptions } from '@apollo/client';
import { AnonymousJobQuery, AnonymousJobUpdatedDocument, AnonymousJobUpdatedSubscription, Exact } from '../graphql';

const getAnnonymousJobSubscriptionOptions = (
  id: string,
): SubscribeToMoreOptions<
  AnonymousJobQuery,
  Exact<{
    id: string;
  }>,
  AnonymousJobUpdatedSubscription
> => {
  return {
    document: AnonymousJobUpdatedDocument,
    variables: { id },
    updateQuery: (prev, { subscriptionData }) => {
      const { anonymousJob, ...rest } = prev;
      if (!subscriptionData.data) {
        return prev;
      }
      if (anonymousJob && anonymousJob.progress > subscriptionData.data.anonymousJobUpdated.progress) {
        return prev;
      }

      const { item, __typename: _, ...stack } = subscriptionData.data.anonymousJobUpdated;

      const getItems = () => {
        if (!anonymousJob?.items) {
          return item ? [item] : [];
        } else {
          return item ? [...anonymousJob.items, item] : anonymousJob.items;
        }
      };

      return {
        ...rest,
        anonymousJob: {
          ...stack,
          __typename: anonymousJob?.__typename,
          items: getItems(),
        },
      };
    },
  };
};

export { getAnnonymousJobSubscriptionOptions };
