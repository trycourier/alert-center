import { useState, useCallback } from "react";
import { Text } from "@chakra-ui/react";

import SubscriptionChannels, { Profile } from "../SubscriptionChannels";
import StripeConfigAnnouncement from "./StripeConfigAnnouncement";
import channels from "./channels";

const StripeAlertPreferences = () => {
  const [profile, setProfile] = useState<Profile>({});
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  const onSubscribe = useCallback(
    (channel) =>
      setSubscriptions((currentSubscriptions) => [
        ...currentSubscriptions,
        channel,
      ]),
    []
  );
  const onUnsubscribe = useCallback(
    (channel) =>
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.filter((subscription) => subscription !== channel)
      ),
    []
  );
  const onUpdateProfile = useCallback(
    (profile) =>
      Promise.resolve(
        setProfile((currentProfile) => ({ ...currentProfile, ...profile }))
      ),
    []
  );

  return (
    <>
      <StripeConfigAnnouncement />

      <Text
        p={4}
        my={4}
        fontSize="sm"
        bgColor="gray.50"
        borderWidth={1}
        borderColor="gray.100"
        borderRadius={4}
      >
        Enable and configure the channels you would like to be notified on about
        new successful <strong>Stripe Charge</strong> events:
      </Text>

      <SubscriptionChannels
        channels={channels}
        profile={profile}
        subscriptions={subscriptions}
        onSubscribe={onSubscribe}
        onUnsubscribe={onUnsubscribe}
        onUpdateProfile={onUpdateProfile}
      />
    </>
  );
};

export default StripeAlertPreferences;
