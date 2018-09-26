---
title: Moving To Semantic Versioning
author: Ran Yitzhaki & Ronen Amiel
---

## TL;DR
__Do not use `latest` when using `yoshi` or any of our libraries. Instead, use a valid semantic version. This way, when we release breaking changes, your app will not get the latest version, thus won't break.__

Until not long ago, we worked in a *"latest is the greatest"* manner, which meant that we all need to put `latest` in our `package.json` regarding internal packages like `yoshi` or `wix-style-react`.

### What were the problems?
Whenever we had to release a breaking change, we made it available only with a feature toggle which required an action from you. Then we had to ask you to opt-into it, and eventually remove the old way and ask you to opt-out again. Also, it didn't work for changes like bumping the version of a major dependency like `eslint` or `jest`. This made it really hard for us to move forward, and our tools and you suffered because of it.

### The solution
With [semver](https://semver.org/), whenever we need to release a breaking change we can release it as a new major version. You and all other users won't be affected, you'll have to go to our `CHANGELOG.md`, see what has changed, and adjust to the changes. This makes the process much simpler. We will do our best to make it as easy as we can.

### what is `semver`

> * MAJOR version when you make incompatible API changes,
> * MINOR version when you add functionality in a backwards-compatible manner, and
> * PATCH version when you make backwards-compatible bug fixes.

If the owner of the package respects that, it means breaking changes will occur only on major versions and it's safe to list the package as `^2.0.0` for example instead of `latest`.

The `^` is a sign [respected by the package manager](https://docs.npmjs.com/getting-started/semantic-versioning#semver-for-consumers) and says that you want to get updates from `patch` and `minor` versions.

**This also means that you'll need to update major version manually!**

With every major version, we will provide a migration guide that will tell you which API broke, or what you should do in order to move to the next version.

***

**Wait! how do I make sure I don't stay behind?**

Don't worry, we use [depkeeper](https://github.com/wix/depkeeper), that will notify you in case you didn't update versions for too long.
