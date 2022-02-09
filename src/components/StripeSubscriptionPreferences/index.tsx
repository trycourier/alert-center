import { Text } from "@chakra-ui/react";

import ServiceSubscriptionMethods from "../ServiceSubscriptionMethods";
import StripeSetupBanner from "./StripeSetupBanner";

const StripeSubscriptionPreferences = () => {
  return (
    <>
      <StripeSetupBanner />

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

      <ServiceSubscriptionMethods service="stripe" />
    </>
  );
};

export default StripeSubscriptionPreferences;
