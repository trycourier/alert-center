import { Channel } from "../SubscriptionChannels";

const channels: Channel[] = [
  {
    name: "email",
    label: "Email",
    configs: [
      {
        name: "email",
        label: "Email",
      },
    ],
  },
  {
    name: "sms",
    label: "SMS",
    configs: [
      {
        name: "phone_number",
        label: "Phone Number",
      },
    ],
  },
  {
    name: "slack",
    label: "Slack",
    configs: [
      {
        name: "slack.access_token",
        label: "Access Token",
      },
      {
        name: "slack.email",
        label: "Email",
        optional: true,
      },
      {
        name: "slack.user_id",
        label: "... or User ID",
        optional: true,
      },
      {
        name: "slack.channel",
        label: "... or Channel ID",
        optional: true,
      },
    ],
  },
];

export default channels;
