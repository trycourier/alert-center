import { Stack, StackDivider } from "@chakra-ui/react";

import SubscriptionChannel, { Channel, Profile } from "./SubscriptionChannel";

export type { Channel, Profile };

interface SubscriptionChannelsProps {
  channels: Channel[];
  subscriptions: string[];
  profile: Profile;
  onSubscribe: (channel: string) => void;
  onUnsubscribe: (channel: string) => void;
  onUpdateProfile: (profile: Profile) => Promise<any>;
}

const SubscriptionChannels = ({
  channels,
  subscriptions,
  profile,
  onSubscribe,
  onUnsubscribe,
  onUpdateProfile,
}: SubscriptionChannelsProps) => {
  return (
    <Stack pt={6} spacing={6} divider={<StackDivider borderColor="gray.200" />}>
      {channels.map((channel) => {
        return (
          <SubscriptionChannel
            key={channel.name}
            channel={channel}
            profile={profile}
            subscriptions={subscriptions}
            onSubscribe={onSubscribe}
            onUnsubscribe={onUnsubscribe}
            onUpdateProfile={onUpdateProfile}
          />
        );
      })}
    </Stack>
  );
};

export default SubscriptionChannels;
