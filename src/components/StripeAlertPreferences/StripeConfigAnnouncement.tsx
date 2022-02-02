import { Input, Code, Link } from "@chakra-ui/react";

import Announcement from "../Announcement";

const StripeConfigAnnouncement = () => {
  return (
    <Announcement title="Stripe Webhook URL">
      Create a{" "}
      <Link
        isExternal
        href="https://dashboard.stripe.com/test/webhooks/create"
        color="purple.500"
      >
        Stripe Webhook
      </Link>{" "}
      with following Endpoint URL and select{" "}
      <Code colorScheme="blackAlpha" fontSize="xs">
        charge.succeeded
      </Code>{" "}
      event to listen to.
      <Input
        size="sm"
        mt={2}
        value={`https://${process.env.REACT_APP_VERCEL_URL}/api/stripe-webhook`}
        variant="outline"
        readOnly
        bgColor="white"
      />
    </Announcement>
  );
};

export default StripeConfigAnnouncement;
