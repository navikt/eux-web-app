import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import winston from 'winston'
import fetch from 'cross-fetch'
import { URLSearchParams } from 'url'
import { Issuer } from 'openid-client'
import * as jose from 'jose';
import timeout from 'connect-timeout';

import { fileURLToPath } from 'url';

const app = express();
app.use(timeout('60s'));
app.disable("x-powered-by");

const azureAdConfig = {
  clientId: process.env.AZURE_APP_CLIENT_ID,
  clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT
};

let _issuer
let _remoteJWKSet

const onBehalfOf = function(scope, assertion) {
  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("client_id", azureAdConfig.clientId);
  params.append("client_secret", azureAdConfig.clientSecret);
  params.append("scope", scope);
  params.append("assertion", assertion);
  params.append("requested_token_use", "on_behalf_of");
  return fetch(azureAdConfig.tokenEndpoint, {
    body: params,
    method: "POST"
  });
}

const logger = winston.createLogger({
  transports: new winston.transports.Console({
    level: "info",
    handleExceptions: true,
    colorize: false,
  }),
  exitOnError: false,
});

async function validerToken(token) {
  return jose.jwtVerify(token, await jwks(), {
    issuer: (await issuer()).metadata.issuer,
  });
}

async function jwks() {
  if (typeof _remoteJWKSet === "undefined") {
    _remoteJWKSet = jose.createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI));
  }

  return _remoteJWKSet;
}

async function issuer() {
  if (typeof _issuer === "undefined") {
    if (!process.env.AZURE_APP_WELL_KNOWN_URL)
      throw new Error(`Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være satt`);
    _issuer = await Issuer.discover(process.env.AZURE_APP_WELL_KNOWN_URL);
  }
  return _issuer;
}

const validateAuthorization = async (authorization) => {
  try {
    const token = authorization.split(" ")[1];
    const JWTVerifyResult = await validerToken(token);
    return !!JWTVerifyResult?.payload;
  } catch (e) {
    logger.error('azure ad error', e);
    return false;
  }
}

const handleCallback = (req, res) => {
  //let paths = req.originalUrl.split('/')
  // /callback/123/456/789/012/Uføretrygd/ => ['', 'callback', '123', '456', '789', '012', 'Uføretrygd']

  //logger.debug('handleCallback: redirecting to ' + redirectPath)
  logger.debug('handleCallback: redirecting to redirect path')
  res.redirect("/")
}

// require token
const apiAuth = function (scope) {
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      logger.debug('redirecting to /oauth2/login')
      res.redirect("/oauth2/login");
    } else {
      try {
        //logger.debug('apiAuth: trying onBehalfOf with ' + req.headers.authorization)
        logger.error("header ", req.headers.authorization.substring("Bearer ".length))
        const response = await onBehalfOf(
          scope,
          req.headers.authorization.substring("Bearer ".length)
        );
        const body = await response.json();
        //logger.debug('apiAuth: got ' + body.access_token)
        if (response.ok) {
          res.locals.on_behalf_of_authorization = "Bearer " + body.access_token;
          next();
        } else {
          logger.error(
            "Error fetching on behalf of token. Status code " + response.status
          );
          logger.error(body.error_description);
          logger.error(body);
          res.redirect("/oauth2/login");
        }
      } catch (error) {
        logger.error(error.message);
        res.redirect("/oauth2/login");
      }
    }
  }
}

const apiProxy = function (target, pathRewrite) {
  //logger.debug('On apiProxy, with target ' + target)
  return createProxyMiddleware( {
    target: target,
    logLevel: 'silent',
    changeOrigin: true,
    xfwd: true,
//    pathRewrite: pathRewrite,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      //logger.debug('proxy frontend: adding header auth ' + res.locals.on_behalf_of_authorization)
      proxyReq.setHeader(
        "Authorization",
        res.locals.on_behalf_of_authorization
      )
      proxyReq.removeHeader('io.nais.wonderwall.session')
      proxyReq.removeHeader('JSESSIONID')
      proxyReq.removeHeader('cookie')
      req.cookies
    }
  })
}


// const socketProxy = createProxyMiddleware({
//   target: process.env.VITE_EESSI_PENSJON_WEBSOCKETURL + ':8080-*****/bucUpdate',
//   ws: true
// })
//
const timedOut = function (req, res, next) {
  if (!req.timedout) {
    next()
  } else {
    //logger.warning('request for ' + req.originalUrl + ' timed out!')
    logger.warning('request for original url timed out!')
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/test', (req, res) => res.send('hello world'));

app.get('/callback/*', handleCallback);

app.get('/internal/isAlive|isReady|metrics', (req, res) => res.sendStatus(200));

app.use('/assets', express.static(path.join(__dirname, "build", "assets")));

app.use('/static', express.static(path.join(__dirname, "build", "static")));

app.use('/locales', express.static(path.join(__dirname, "build", "locales")));

app.use('/favicon', express.static(path.join(__dirname, "build", "favicon")));

app.get(["/oauth2/login"], async (req, res) => {
  logger.error("Wonderwall must handle /oauth2/login")
  res.status(502).send({
    message: "Wonderwall must handle /oauth2/login",
  });
});

app.use('/api',
  timedOut,
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  apiProxy(process.env.VITE_NEESSI_BACKEND_URL,{ '^/frontend/' : '/' })
)
app.use('/v2',
  timedOut,
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  apiProxy(process.env.VITE_NEESSI_BACKEND_URL,{ '^/frontend/' : '/' })
)
app.use('/v3',
  timedOut,
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  apiProxy(process.env.VITE_NEESSI_BACKEND_URL,{ '^/frontend/' : '/' })
)
app.use('/v4',
  timedOut,
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  apiProxy(process.env.VITE_NEESSI_BACKEND_URL,{ '^/frontend/' : '/' })
)
app.use('/v5',
  timedOut,
  apiAuth(process.env.VITE_NEESSI_BACKEND_TOKEN_SCOPE),
  apiProxy(process.env.VITE_NEESSI_BACKEND_URL,{ '^/frontend/' : '/' })
)

// app.use('/websocket', socketProxy)

app.use('*', express.static(path.join(__dirname, "build")));

// start express server on port 8080
app.listen(8080, () => {
  logger.info("neessi-frontend started on port 8080");
});
