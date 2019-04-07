# out-of-iframe-app

Start with setting up your app in Dev Center, follow the step-by-step instructions [here](http://wixplorer.wixpress.com/out-of-iframe/guides/DEV%20Center%20Configuration).

Out of iframe docs:
http://wixplorer.wixpress.com/out-of-iframe/guides/Overview

Configure `src/config/index.js` with your widgets ids and experiments scope.

#### Accepting selfsigned certificates from `localhost`

The dev server on this project uses a self signed certificate created via:

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 1825 -subj '/CN=localhost'
```

Additional configuration is required on your browser for it to accept working with it:
Open Chrome and paste this is the omnibox:

```
chrome://flags/#allow-insecure-localhost
```

Then click `Enable` under the highlighted flag reading

> Allow invalid certificates for resources loaded from localhost.

Another option is to use [mkcert](https://github.com/FiloSottile/mkcert) to create your own CA and certificates instead of a self-signed certificate.
