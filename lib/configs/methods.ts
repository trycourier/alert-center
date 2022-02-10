export type Profile = Record<string, string | Record<string, string>>;

export interface ProfileField {
  // The path of profile field in Courier Recipient Profile
  name: keyof Profile;
  // Label for the field to show in the Preferences UI
  label: string;
  // Though the fields are required by default, you can mark them as optional
  optional?: boolean;
}

interface MethodConfig {
  // Label to show for the Method in the Preferences UI
  label: string;
  // The provider to use for the channel
  provider: string;
  // The channel to route the notification to
  channel: string;
  // All the profile fields that need to be configured for the method
  profileFields: ProfileField[];
}

// The type for the subscription object the will be passed to the client
export interface PublicSubscription
  extends Omit<MethodConfig, "provider" | "channel"> {
  method: Method;
  subscribed: boolean;
}

// A helper function to let TypeScript correctly infer types
const createMethodConfigs = <Name extends string>(
  methodConfigs: Record<Name, MethodConfig>
) => methodConfigs;

// All Notification methods supported by the app, across all services
export const methodConfigs = createMethodConfigs({
  email: {
    label: "Email",
    provider: process.env.COURIER_EMAIL_PROVIDER || "",
    channel: "email",
    profileFields: [
      {
        name: "email",
        label: "Email",
      },
    ],
  },
  sms: {
    label: "SMS",
    provider: process.env.COURIER_SMS_PROVIDER || "",
    channel: "direct_message",
    profileFields: [
      {
        name: "phone_number",
        label: "Phone Number",
      },
    ],
  },
  slack: {
    label: "Slack",
    provider: "slack",
    channel: "direct_message",
    profileFields: [
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
});

export type Method = keyof typeof methodConfigs;

const methods = Object.keys(methodConfigs) as Method[];

export default methods;
