# Courier Alert Center

This is a Demo project, showcasing how you can use [Courier](https://www.courier.com) to build a
fully customizable Alert Center, where every user can configure their preferences and receive
alerts on their preferred channels.

This project uses the Courier [Profiles API](https://www.courier.com/docs/reference/profiles/) to store user info, [Lists API](https://www.courier.com/docs/reference/lists/list/) to save user subscriptions, and the brand new [✨ Send API](https://www.courier.com/docs/reference/send/message/) to send the alerts to the subscribers with the _inline_ message content and routing generated programmatically, instead of having to create a template in the [Courier App](https://app.courier.com/) first, and providing the template id.

We are also using the new [🧱 Elemental Syntax](https://www.courier.com/docs/) for the message content, which is a new spec allowing to easily construct complex message layouts without compromising on the flexibility.

[**See the live demo**](https://alert-center.vercel.app/)

### Currently Supported Services

- [Stripe](https://stripe.com/) `charge.succeeded` events
- _more coming soon..._
- _...why not [build](#customization) your own one?_

## Prerequisites

- [Courier](https://www.courier.com) account, with providers installed and configured for [Email](https://www.courier.com/docs/guides/providers/email/),
  [SMS](https://www.courier.com/docs/guides/providers/sms/) and [Slack](https://www.courier.com/docs/guides/providers/direct-message/slack/)
- [Vercel](https://vercel.com) account to host your project
- [Auth0](https://auth0.com) account to handle authorization
- [Stripe](https://stripe.com) account to listen to `charge.succeeded` events

## How to Set up

Use the button below to deploy your app instance to Vercel with a single click. Check out the
[_Environment Variables_](#environment-variables) section below to learn how to get your env variables to get it running.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftrycourier%2Falert-center&env=COURIER_AUTH_TOKEN,COURIER_SMS_PROVIDER,COURIER_EMAIL_PROVIDER,STRIPE_SECRET,STRIPE_ENDPOINT_SECRET,REACT_APP_AUTH0_DOMAIN,REACT_APP_AUTH0_CLIENT_ID&envDescription=Please%20take%20a%20look%20at%20the%20repository's%20Readme%20to%20learn%20more%20about%20each%20of%20the%20env%20variable&envLink=https%3A%2F%2Fgithub.com%2Ftrycourier%2Falert-center%23environment-variables&demo-title=Alerts%20Center&demo-description=Courier%20Alerts%20Center&demo-url=https%3A%2F%2Falert-center.vercel.app)

### Environment Variables

#### `COURIER_AUTH_TOKEN`

Your Courier Auth Token you can get from [here](https://app.courier.com/settings/api-keys).

#### `COURIER_SMS_PROVIDER`

The name of the SMS provider you have configured in Courier.
(_eg. [twilio](https://www.courier.com/docs/guides/providers/sms/twilio/)_)

#### `COURIER_EMAIL_PROVIDER`

The name of the Email provider you have configured in Courier.
(_eg. [sendgrid](https://www.courier.com/docs/guides/providers/email/sendgrid/)_)

#### `STRIPE_SECRET`

Stripe API Secret key you can get from [here](https://dashboard.stripe.com/test/apikeys).

#### `STRIPE_ENDPOINT_SECRET`

_Note:_ you can skip this for the initial deployment. When you open the app a message will appear with the correct endpoint url to use in your Stripe account as the Webhook url.

Create a new Endpoint in [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks) with the url
of `{YOUR_VERCEL_DEPLOYMENT_URL}/api/stripe-webhook` and enable it to listen to `charge.succeeded`
events. Use the provided Signing secret as the value for this variable.

#### `REACT_APP_AUTH0_DOMAIN`

Your application's Auth0 domain.

#### `REACT_APP_AUTH0_CLIENT_ID`

Auth0 Application's Client ID. You can create a new _Single Page Web Application_ project in
[Auth0 dashboard](https://manage.auth0.com/dashboard) to use with this project if you don't have one
yet.

#### `REACT_APP_HIDE_SETUP_BANNERS` (_optional_)

The project will show setup banners by default to help configure the app. When it's running in
production, you can set this variable to `true` to hide the setup banners.

### Debugging

Check out the [Courier Messages](https://app.courier.com/data/messages) page to see all the messages that are being sent by the app. If you don't see the message there, then it's likely that the app `COURIER_AUTH_TOKEN` environment variable is not set correctly. See the [Environment Variables](#environment-variables) section above for more details on how to configure it correctly.

To test the Stripe webhook, you can install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and trigger a test event by running the following command: `stripe trigger charge.succeeded`.

Any API errors will show up in the logs.

## How to Use

1. Use the _Log In_ button to authenticate your Auth0 account.
2. You will presented with the list of available Alert Services as tabs and each tab will have a list of available notification methods with checkboxes next to each of them.
3. Just enable the notification methods you want to subscribe by the Alert and fill in the required fields for that method that will show up right below the checkbox.
4. Click the "Save Config" button to save your profile fields.

   - You can use the "Send Test" button to test the configuration. This will send a test message with the selected notification method. As long as this test message is received successfully, the configuration is valid!

5. Just sit back, relax, and enjoy the alerts!

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
but additionally utilizes
[Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions) to
create API bridges to Courier and webhooks for the supported alert services.

`yarn start` command was replaced to run `vercel dev` so that's it's possible to use Vercel
Serverless functions on local environment. Otherwise, the app is a pure Create React App.

### Customization

You might want to implement your own Alert Service instead of Stripe `charge.succeeded` event or alongside it. This should be pretty straightforward.

The app includes **4 API endpoints**:

- `/api/profile`
- `/api/test`
- `/api/[service]/subscriptions`
- `/api/stripe-webhook`

**The first 3** of them are general purpose endpoints that will work for any Alert Service. So you don't need to change anything there.

The **last one** is for Stripe only and includes logic to verify webhook signature and needed to parse the event data, as well as the logic of constructing and sending the notification to the list of subscribers. If you want to implement your own Alert Service, you'll need to overwrite the Stripe specific code there to handle the data from your own webhook service.

The only other you would need to make is to add your own Alert Service to the **`lib/configs/services.ts`** file.

Optionally, if you are adding more Notification Methods, other than currently supported ones (Email, SMS, Slack), you'll need to add them to the `lib/configs/methods.ts` file.

**Client side** code is written to work with the data provided from the API endpoints, so the changes here are minimal. You just need to render a `<ServiceSubscriptionMethods service="SERVICE_NAME" />` somewhere, which will render the subscription preferences for the Alert Service. See `src/StripeSubscriptionPreferences/index.tsx` for an example. You probably want to render your new component in the `src/components/PageTabs/index.tsx` file.
