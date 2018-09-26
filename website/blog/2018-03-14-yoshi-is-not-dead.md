---
title: Yoshi Is Not Dead
author: Ran Yitzhaki & Ronen Amiel
---

Hey Feds,
We made some changes recently in `haste`/`yoshi`/`generators`. We’ll try to shed some light on the topic.

### Some history
A few months ago we moved from [`yoshi`](https://github.com/wix/yoshi) to [`haste-preset-yoshi`](https://github.com/wix-private/wix-haste/blob/master/README.md).
`haste-preset-yoshi` is practically `yoshi`, nothing changed, same yoshi config, same behaviour, we actually used the same test suite. We only replaced the engine that runs yoshi, to help us deliver faster builds.

### Moving back to yoshi
**TL;DR - We are going back to use `yoshi` in our `package.json` and as a dependency. Haste will be used internally by Yoshi as its engine**

Using a `haste` bin was a mistake, Haste is just an engine that helps to create and run toolkits.
For example, `yoshi` is a toolkit, and we could have changed Yoshi’s implementation without affecting you, our users. We understand that this change led to a lot of confusion and we are sorry about it.

We understand that naming our toolkit `haste-preset-yoshi` was wrong. We don’t want the users to know how their toolkit work under the hood. Each toolkit (Yoshi including) will have its own binary file (different command name in `package.json`).

In the future, we plan to remove the `haste` binary and change the name of the toolkit back to `yoshi`. We’ve already removed the requirement to specify a `preset` in `package.json` and added `yoshi` as a working binary to `haste-preset-yoshi`. We’ve also changed it in the generators.

***

*P.S.* Watch [Dan Abramov’s talk](https://www.youtube.com/watch?v=G39lKaONAlA) if you’re interested in the idea of toolkits.
