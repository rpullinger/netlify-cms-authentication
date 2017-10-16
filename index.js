require('dotenv').config();
const express = require('express');
const simpleAuth = require('simple-oauth2');
const randomString = require('crypto-random-string');
const ejs = require('ejs');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  PROVIDER = 'github',
  GITHUB_HOSTNAME = 'https://github.com',
  REDIRECT_URL,
  SCOPES,
  PORT = 4000
} = process.env;

const providers = {
  github: {
    key: 'github',
    auth: {
      tokenHost: GITHUB_HOSTNAME,
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize'
    },
    scope: SCOPES || 'repo'
  }
}

const provider = providers[PROVIDER];

const auth = simpleAuth.create({
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET
  },
  auth: provider.auth
});

const authURL = auth.authorizationCode.authorizeURL({
  redirect_uri: REDIRECT_URL,
  scope: provider.scope,
  state: randomString(12)
});

const getMessageScript = (provider, state, content) => `
  <script>
    function recieveMessage(e) {
      window.opener.postMessage(
        'authorization:${provider}:${state}:${content}',
        e.origin
      );
    }
    window.addEventListener('message', recieveMessage, false);
    window.opener.postMessage('authorizing:${provider}', '*');
  </script>
`;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/auth', (req, res) => {
  res.redirect(authURL);
});

app.get('/callback', (req, res) => {
  const code = req.query.code;
  auth.authorizationCode.getToken({ code })
    .then((result) => {
      if (result.error) {
        return JSON.stringify(result);
      }

      const token = auth.accessToken.create(result);
      return JSON.stringify({
        token: token.token.access_token,
        provider: provider
      });
    })
    .then((response) => {
      const state = response.error ? 'error' : 'success';
      return getMessageScript(PROVIDER, state, response);
    })
    .then((script) => {
      res.send(script);
    });
});

app.get('/', (req, res) => {
  res.render('index', {
    url: req.protocol + '://' + req.get('Host') + req.url.replace('/', ''),
    provider: PROVIDER,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  });
});

app.listen(PORT);
