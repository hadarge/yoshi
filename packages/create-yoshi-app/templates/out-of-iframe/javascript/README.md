# Out of IFrame App

- [Overview](#overview)
- [Initial Setup](#initial-setup)
- [Local Development](#local-development)
- [Testing](#testing)
  - [Viewer App](#viewer-app)
    - [E2E Against Production](#e2e-against-production)
    - [SSR](#ssr)
  - [Editor App & Settings Panel](#editor-app--settings-panel)
    - [E2E Against Locally Served HTMLs](#e2e-against-locally-served-htmls)
  - [Component & Unit Tests](#component--unit-tests)
- [Deployment](#deployment)
  - [Register an App in Wix's Dev Center](#register-an-app-in-wix-s-dev-center)
  - [Deploy a new version](#deploy-a-new-version)
- [OOI Development App](#ooi-development-app)

## Overview

**OOI app is constructed from 3 parts:**

1. **Viewer App**

> Consists of 2 assets, the `Widget` is the React component and the `viewerScript` is the "controller" part which runs in a web worker.

2. **Editor App**
3. **Settings Panel**

> Both `EditorApp` and `SettingsPanel` are still being run inside an iframe, which means that a separate server will have to read [`editorApp.vm`](./src/templates/editorApp.vm) and [`settingsPanel.vm`](./src/templates/editorApp.vm) files and serve them as `HTML`.

`out-of-iframe` is a code name for a platform that enables creating Wix Apps that lives in the Viewer's main frame. It's similar to the old TPA but should be more performant. For more information head to the [official docs](https://bo.wix.com/wix-docs/client/client-frameworks#out-of-iframe).

## Initial Setup

```
npm install
```

**Configure chrome to allow invalid certificates for resources loaded from localhost**

> The viewer is running on `https`, thus we need to serve our application on `https` as well. Yoshi is using a self signed certificate which is `invalid` for chrome.

Paste the following in Chrome's omnibox and change the highlighted flag from `Disabled` to `Enabled`.:

```
chrome://flags/#allow-insecure-localhost
```

## Local Development

**Develop your local app on production platforms**

```
npm start
```

This command runs `yoshi start` and opens two tabs:

1. Production **viewer** with a site that has the [ooi development app](#ooi-development-app), it points to your local _viewer script_ and _viewer widget_.

2. Production **editor** with a site that has the [ooi development app](#ooi-development-app), It points to your local _editor app_ and _settings panel_.

## Testing

Run `npm start`, open another terminal and run `npx jest --watch`

> Tip - If you are using `iterm2` use `cmd`+`d` to split the window vertically

### Viewer App

#### E2E Against Production

Using the ooi development app that points to your local _viewer script_ and _viewer widget_.

See [`viewerApp/viewerApp.e2e.js`](./src/viewerApp/viewerApp.e2e.js) for an example.

#### SSR

> TBD

### Editor App & Settings Panel

#### E2E Against Locally Served HTMLs

When running tests, Yoshi runs your [`dev/server.js`](./dev/server.js) as configured in [`jest-yoshi.config.js`](./jest-yoshi.config.js).

See [`editorApp/editorApp.e2e.js`](./src/editorApp/editorApp.e2e.js) & [`settingsPanel/settingsPanel.e2e.js`](./src/settingsPanel/settingsPanel.e2e.js) for an example.

> Testing against the production editor similarly to the viewer app is problematic due to the editor loading time and required authentication.

### Component & Unit Tests

Nothing special about the ooi platform, component tests should be written in the `components` directory. Unit tests can be written everywhere.

## Deployment

### Register an App in Wix's Dev Center

Configure your app in the dev center, follow the step-by-step [instructions](https://bo.wix.com/wix-docs/rest/client-frameworks#out-of-iframe).

### Deploy a new version

> TBD

## OOI Development App

While there are multiple ways to test your app locally, we find that having a Wix app that points to your local machine is the best one.

It's configured as follows:

**Viewer App**

```json
{
  "platform": {
    "baseUrls": {
      "staticsBaseUrl": "https://localhost:3200/"
    },
    "viewerScriptUrl": "https://localhost:3200/viewerScript.bundle.js"
  }
}
```

```json
{
  "componentUrl": "https://localhost:3200/viewerWidget.bundle.js"
}
```

**Editor App (Widget URL)**

```
https://localhost:3000/settingsPanel
```

**Settings Panel (App Settings URL)**

```
https://localhost:3000/editorApp
```

> While you can create your own app, we think it is easier to just reuse the same app between sites.

In order to **open the editor with an empty template** and an option to **add the ooi development app** follow [this link](https://editor.wix.com/html/editor/web/renderer/new?metaSiteId=a573279f-ae6f-46d1-8556-7c93ae9b2c84&siteId=cbf36d3a-49d0-41c2-9482-1bb58d5fdda3&openpanel=market&appDefinitionId=14f11194-f7f1-9b82-9568-f9c5ed98c9b1).

If you want to add the development app into an existing site, open the editor and add the following query parameter to the URL

```
openpanel=market&appDefinitionId=14f11194-f7f1-9b82-9568-f9c5ed98c9b1
```
