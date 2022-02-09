# Courier Alert Center

This is a Demo project, showcasing how you can use [Courier](https://www.courier.com) to build a
fully customizable Alert Center, where every user can configure their preferences and receive
alerts on their preferred channels.

### Currently Supported Services

- [Stripe](https://stripe.com/) `charge.succeeded` events
- _more coming soon..._

## Prerequisites

- [Courier](https://www.courier.com) account, with providers installed and configured for Email,
  SMS and Slack
- [Auth0](https://auth0.com) account to handle authorization
- [Stripe](https://stripe.com) account to listen to `charge.succeeded` events
- [Vercel](https://vercel.com) account to host your project

## Single Click Deploy

Use the button below to deploy your project to Vercel with a single click. Check out the
_Environment Variables_ section below to learn how to get your env variables to get it running.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftrycourier%2Falert-center&env=COURIER_AUTH_TOKEN,COURIER_SMS_PROVIDER,COURIER_EMAIL_PROVIDER,STRIPE_SECRET,STRIPE_ENDPOINT_SECRET,REACT_APP_AUTH0_DOMAIN,REACT_APP_AUTH0_CLIENT_ID&envDescription=Please%20take%20a%20look%20at%20the%20repository's%20Readme%20to%20learn%20more%20about%20each%20of%20the%20env%20variable&envLink=https%3A%2F%2Fgithub.com%2Ftrycourier%2Falert-center&demo-title=Alerts%20Center&demo-description=Courier%20Alerts%20Center&demo-url=https%3A%2F%2Falert-center.vercel.app)

## Required Environment Variables

### `COURIER_AUTH_TOKEN`

Your Courier Auth Token you can get from [here](https://app.courier.com/settings/api-keys).

### `COURIER_SMS_PROVIDER`

The name of the SMS provider you have configured in Courier.
(_eg. twilio_)

### `COURIER_EMAIL_PROVIDER`

The name of the Email provider you have configured in Courier.
(_eg. sendgrid_)

### `STRIPE_SECRET`

Stripe API Secret key you can get from [here](https://dashboard.stripe.com/test/apikeys).

### `STRIPE_ENDPOINT_SECRET`

Create a new Endpoint in [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks) with the url
of `{YOUR_VERCEL_DEPLOYMENT_URL}/api/stripe-webhook` and enable it to listen to `charge.succeeded`
events. Use the provided Signing secret as the value for this variable.

### `REACT_APP_AUTH0_DOMAIN`

Your application's Auth0 domain.

### `REACT_APP_AUTH0_CLIENT_ID`

Auth0 Application's Client ID. You can create a new _Single Page Web Application_ project in
[Auth0 dashboard](https://manage.auth0.com/dashboard) to use with this project if you don't have one
yet.

### `REACT_APP_HIDE_SETUP_BANNERS`

The project will show setup banners by default to help configure the app. When it's running in
production, you can set this variable to `true` to hide the setup banners.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
but additionally utilizes
[Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions) to
create API bridges to Courier and webhooks for the supported alert services.

`yarn start` command was replaced to run `vercel dev` so that's it's possible to use Vercel
Serverless functions on local environment. Otherwise, the app is a pure Create React App.
