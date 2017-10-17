# Netlify CMS authentication

A simple to deploy OAuth authenticator for the [Netlify CMS](https://www.netlifycms.org/). By default the Netlify CMS uses the it's own product to authenticate users. This allows you to provide your own OAuth endpoint.

## How to use?

### 1. Setup your OAuth app on your chosen provider
* GitHub – [Registering OAuth Apps](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/registering-oauth-apps/)
* ~~GitLab~~ – Coming soon
* ~~Bitbucket~~ – Coming soon

*Once you have set up your OAuth app save the `CLIENT_ID` and `CLIENT_SECRET` ready for the next step.*

### 2. Deploy the project

#### Heroku
  * [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
  * Update the environment variables with your `CLIENT_ID` and `CLIENT_SECRET`
  * Click `View App`
  

#### Locally
  * `git clone https://github.com/rpullinger/netlify-cms-authentication`
  * `yarn install`
  * Copy `.env.example` to `.env` and update your `CLIENT_ID` and `CLIENT_SECRET`
  * `yarn start`
  * `open http://localhost:4000`


### 3. Update the OAuth app with the new URL

Update your OAuth application to use your new URL. For example – `https://xxxxxx-xxxxx-xxxxx.herokuapp.com/callback`.

### 4. Update your `config.yml` with base URL

In your Netlify CMS `config.yml` add or update the `base_url` option. For example – `base_url: https://xxxxxx-xxxxx-xxxxx.herokuapp.com`. *Note there is no training slash.*

## Environment variables

```bash
CLIENT_ID # The client ID from the chosen provider (Required)
CLIENT_SECRET # The client secret from the chosen provider (Required)
PROVIDER # The provider to use. Defaults to github
GITHUB_HOSTNAME # A custom hostname to use for GitHub. Used to support enterprise installs
SCOPES # The scopes to request
PORT # The port to run the express app on. Defaults to 4000
```

## URLs

### Base

`https://xxxxxx-xxxxx-xxxxx.herokuapp.com`

Add `base_url: https://xxxxxx-xxxxx-xxxxx.herokuapp.com` to your `config.yml`.

### Callback URL

`https://xxxxxx-xxxxx-xxxxx.herokuapp.com/callback`

Use this as the callback URL on your providers OAuth app settings.

### Authentication URL

`https://xxxxxx-xxxxx-xxxxx.herokuapp.com/auth`

Netlify will automatically redirect here from the login screen once `base_url` is set.


