export type Profile = Record<string, string | Record<string, string>>;

export interface ProfileField {
  name: keyof Profile;
  label: string;
  optional?: boolean;
}

interface MethodConfig {
  label: string;
  provider: string;
  channel: string;
  profileFields: ProfileField[];
}

export interface PublicSubscription
  extends Omit<MethodConfig, "provider" | "channel"> {
  method: Method;
  subscribed: boolean;
}

const createMethodConfigs = <Name extends string>(
  methods: Record<Name, MethodConfig>
) => methods;

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
