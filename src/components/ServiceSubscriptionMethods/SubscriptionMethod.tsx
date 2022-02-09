import { useMemo, useCallback } from "react";
import { Stack, Text, Button, Flex, Checkbox } from "@chakra-ui/react";
import _ from "lodash";
import { Formik, Form, FormikHelpers } from "formik";

import SubscriptionProfileField from "./SubscriptionProfileField";

import type { PublicSubscription, Profile } from "../../../lib/configs/methods";

interface SubscriptionMethodProps {
  subscription: PublicSubscription;
  profile: Profile;
  onSubscribe: (method: string) => void;
  onUnsubscribe: (method: string) => void;
  onUpdateProfile: (profile: Profile) => Promise<any>;
  onTest: (method: string) => Promise<any>;
}

const SubscriptionMethod = ({
  subscription,
  profile,
  onSubscribe,
  onUnsubscribe,
  onUpdateProfile,
  onTest,
}: SubscriptionMethodProps) => {
  const profileFilled = useMemo(
    () =>
      subscription.profileFields.some(
        (field) => !field.optional && _.get(profile, field.name)
      ),
    [subscription.profileFields, profile]
  );

  const initialValues = useMemo(
    () =>
      subscription.profileFields.reduce(
        (values, field) =>
          _.set(values, field.name, _.get(profile, field.name, "")),
        {}
      ),
    [subscription.profileFields, profile]
  );

  const onToggleActive = useCallback(
    (event) => {
      if (event.target.checked) {
        onSubscribe(subscription.method);
      } else {
        onUnsubscribe(subscription.method);
      }
    },
    [subscription.method, onSubscribe, onUnsubscribe]
  );

  const onSubmit = useCallback(
    async (values: Profile, helpers: FormikHelpers<Profile>) => {
      if (_.isEqual(values, initialValues)) {
        await onTest(subscription.method);
      } else {
        await onUpdateProfile(values);

        helpers.resetForm();
      }
    },
    [subscription.method, onUpdateProfile, onTest, initialValues]
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
              colorScheme={profileFilled ? "purple" : "gray"}
              isChecked={subscription.subscribed}
              isIndeterminate={subscription.subscribed && !profileFilled}
              onChange={onToggleActive}
            >
              {subscription.label}
              <Text as="span" color="gray.500" fontSize="sm" fontWeight={400}>
                {" "}
                (
                {profileFilled
                  ? subscription.profileFields.length === 1
                    ? _.get(profile, subscription.profileFields[0].name)
                    : "configured"
                  : subscription.profileFields.length === 1
                  ? `add ${subscription.profileFields[0].label.toLowerCase()}`
                  : "configuration needed"}
                )
              </Text>
            </Checkbox>

            {subscription.subscribed && (dirty || profileFilled) && (
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

          {subscription.subscribed && (
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
              {subscription.profileFields.map((field) => (
                <SubscriptionProfileField key={field.name} field={field} />
              ))}
            </Stack>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SubscriptionMethod;
