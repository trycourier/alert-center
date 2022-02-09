import { useCallback } from "react";
import {
  Stack,
  StackDivider,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";

import useWrappedFetch from "../../hooks/useWrappedFetch";

import type { PublicSubscription, Profile } from "../../../lib/configs/methods";
import type { Service } from "../../../lib/configs/services";
import SubscriptionMethod from "./SubscriptionMethod";

interface ServiceSubscriptionMethodsProps {
  service: Service;
}

const ServiceSubscriptionMethods = ({
  service,
}: ServiceSubscriptionMethodsProps) => {
  const { isAuthenticated } = useAuth0();
  const wrappedFetch = useWrappedFetch();

  const {
    data: { subscriptions } = {},
    error: subscriptionsError,
    mutate: mutateSubscriptions,
  } = useSWR<{ subscriptions: PublicSubscription[] }>(
    isAuthenticated && `/api/${service}/subscriptions`,
    wrappedFetch
  );

  const {
    data: { profile } = {},
    error: profileError,
    mutate: mutateProfile,
  } = useSWR<{ profile: Profile }>(
    isAuthenticated && "/api/profile",
    wrappedFetch
  );

  const onSubscribe = useCallback(
    (method) => {
      const optimisticData = {
        subscriptions:
          subscriptions?.map((subscription) =>
            subscription.method === method
              ? { ...subscription, subscribed: true }
              : subscription
          ) || [],
      };

      mutateSubscriptions(
        async () => {
          await wrappedFetch(`/api/${service}/subscriptions`, {
            method: "POST",
            body: JSON.stringify({ method }),
          });

          return optimisticData;
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData,
        }
      );
    },
    [wrappedFetch, mutateSubscriptions, subscriptions, service]
  );

  const onUnsubscribe = useCallback(
    (method) => {
      const optimisticData = {
        subscriptions:
          subscriptions?.map((subscription) =>
            subscription.method === method
              ? { ...subscription, subscribed: false }
              : subscription
          ) || [],
      };

      mutateSubscriptions(
        async () => {
          await wrappedFetch(`/api/${service}/subscriptions`, {
            method: "DELETE",
            body: JSON.stringify({ method }),
          });

          return optimisticData;
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData,
        }
      );
    },
    [wrappedFetch, mutateSubscriptions, subscriptions, service]
  );

  const onUpdateProfile = useCallback(
    (profile) =>
      mutateProfile(
        async (data) => {
          await wrappedFetch("/api/profile", {
            method: "POST",
            body: JSON.stringify({ profile }),
          });

          return { profile: { ...data?.profile, ...profile } };
        },
        { revalidate: false }
      ),
    [wrappedFetch, mutateProfile]
  );

  const onTest = useCallback(
    (method) =>
      wrappedFetch("/api/test", {
        method: "POST",
        body: JSON.stringify({ method }),
      }),
    [wrappedFetch]
  );

  if (subscriptionsError || profileError) {
    return (
      <Alert status="error" variant="left-accent">
        <AlertIcon />
        Error loading data
      </Alert>
    );
  }

  if (!subscriptions || !profile) {
    return (
      <Flex mt={6} alignItems="center" color="gray.700" fontSize="sm">
        <Spinner color="gray.500" emptyColor="gray.50" size="md" mr={4} />
        Loading...
      </Flex>
    );
  }

  return (
    <Stack pt={6} spacing={6} divider={<StackDivider borderColor="gray.200" />}>
      {subscriptions.map((subscription) => (
        <SubscriptionMethod
          key={subscription.method}
          subscription={subscription}
          profile={profile}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
          onUpdateProfile={onUpdateProfile}
          onTest={onTest}
        />
      ))}
    </Stack>
  );
};

export default ServiceSubscriptionMethods;
