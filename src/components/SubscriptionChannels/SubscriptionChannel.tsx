import { useMemo, useCallback } from "react";
import { Stack, Text, Button, Flex, Checkbox } from "@chakra-ui/react";
import _ from "lodash";
import { Formik, Form, FormikHelpers } from "formik";

import SubscriptionChannelConfig, {
  SubscriptionConfig,
} from "./SubscriptionChannelConfig";

export type Profile = Record<string, string | Record<string, string>>;

export interface Channel {
  name: string;
  label: string;
  configs: SubscriptionConfig[];
}

interface SubscriptionChannelProps {
  channel: Channel;
  profile: Profile;
  subscriptions: string[];
  onSubscribe: (channel: string) => void;
  onUnsubscribe: (channel: string) => void;
  onUpdateProfile: (profile: Profile) => Promise<any>;
}

const SubscriptionChannel = ({
  channel,
  profile,
  subscriptions,
  onSubscribe,
  onUnsubscribe,
  onUpdateProfile,
}: SubscriptionChannelProps) => {
  const isActive = useMemo(
    () => subscriptions.includes(channel.name),
    [channel.name, subscriptions]
  );
  const isConfigured = useMemo(
    () =>
      channel.configs.some(
        (config) => !config.optional && _.get(profile, config.name)
      ),
    [channel.configs, profile]
  );
  const initialValues = useMemo(
    () =>
      channel.configs.reduce(
        (values, config) =>
          _.set(values, config.name, _.get(profile, config.name, "")),
        {}
      ),
    [channel.configs, profile]
  );
  const onToggleActive = useCallback(
    (event) => {
      if (event.target.checked) {
        onSubscribe(channel.name);
      } else {
        onUnsubscribe(channel.name);
      }
    },
    [channel.name, onSubscribe, onUnsubscribe]
  );
  const onSubmit = useCallback(
    async (values: Profile, helpers: FormikHelpers<Profile>) => {
      await onUpdateProfile(values);

      helpers.resetForm();
    },
    [onUpdateProfile]
  );

  return (
    <Formik<Profile>
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ dirty, isSubmitting }) => (
        <Form>
          <Flex>
            <Checkbox
              display="flex"
              spacing={4}
              colorScheme={isConfigured ? "purple" : "gray"}
              isChecked={isActive}
              isIndeterminate={isActive && !isConfigured}
              onChange={onToggleActive}
            >
              {channel.label}
              <Text as="span" color="gray.500" fontSize="sm" fontWeight={400}>
                {" "}
                (
                {isConfigured
                  ? channel.configs.length === 1
                    ? _.get(profile, channel.configs[0].name)
                    : "configured"
                  : channel.configs.length === 1
                  ? `add ${channel.configs[0].label.toLowerCase()}`
                  : "configuration needed"}
                )
              </Text>
            </Checkbox>

            {isActive && (dirty || isConfigured) && (
              <Button
                size="xs"
                ml="auto"
                colorScheme="purple"
                variant="outline"
                isLoading={isSubmitting}
                type="submit"
              >
                {dirty ? "Save Config" : "Send Test"}
              </Button>
            )}
          </Flex>

          {isActive && (
            <Stack
              spacing={4}
              mt={6}
              px={4}
              py={3}
              borderLeftWidth={4}
              borderColor="gray.200"
              bgColor="gray.50"
              _empty={{ display: "none" }}
            >
              {channel.configs.map((config) => (
                <SubscriptionChannelConfig key={config.name} config={config} />
              ))}
            </Stack>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SubscriptionChannel;
