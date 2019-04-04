---
id: version-4.x-project-types
title: Project Types
sidebar_label: Project Types
original_id: project-types
---

The following Project Types can be generated using `create-yoshi-app`:

## Client

Only Client project built with [React](https://reactjs.org/). The result is a bundle that will be uploaded to the cdn.

## Fullstack

A [Node.js](https://nodejs.org/en/) Server + Client project. The result is similar to the client, with a server that serves an html file which uses the created bundle.

## Node Library

A [Node.js](https://docs.npmjs.com/getting-started/creating-node-modules) module that should be used by other Node.js applications as a 3rd party dependency.

## Server

Only Server project

## Universal

The server will handle the initial render when a user first requests your app. It will render all of the required components and send the response as a string back to the client ([server-side rendering](https://reactjs.org/docs/react-dom-server.html)). From that point on, the client takes over rendering duties.

The server will also be responsible for making [RPC](https://github.com/wix-private/fed-handbook/blob/master/RPC.md) calls for different services and exposing a RESTful API for it's client application.

**Important Note:** A universal project is significantly more complex than it's fullstack counterpart, unless you require any of these features, it is recommended to use the fullstack project instead.

## Business Manager Module

A client project that integrate with business manager APIs.

---

For more information, see [the templates](https://github.com/wix/yoshi/tree/master/packages/create-yoshi-app/templates)
for those project types
