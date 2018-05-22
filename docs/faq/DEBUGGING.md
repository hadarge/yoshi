# How to debug your code
This guide will help you get started with debugging. There are multiple things you can debug and you need a different configuration for each one:

1. **Debug your client code** - No configuration needed, just open devtools on your browser.
2. **Debug your server code** - `yoshi start --debug`
3. **Debug your tests** - `yoshi test --debug`

When debugging your server/tests you'll need to configure the debugger, depend on your prefered way to debug.

## Enable Inspector
When started with the `--debug` option, Yoshi will allow to attach NodeJS debugger to the relevant child process with the default host and port.
You can configure the default port by: `--debug=XXXX`

### Break before the code starts
When started with the `--debug-brk` option, Yoshi will allow to attach NodeJS debugger and the relevant child process won't start until debugger will be attached.
You can configure the default port by: `--debug-brk=XXXX`.

### [Inspector Clients](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients)

Several commercial and open source tools can connect to Node's Inspector and there for can debug Yoshi tasks. Basic info on these follows:

#### [Chrome DevTools](https://github.com/ChromeDevTools/devtools-frontend)  [55+](https://nodejs.org/en/docs/guides/debugging-getting-started/#chrome-devtools-55)

-   **Option 1**: Open  `chrome://inspect` in a Chromium-based browser. Click the Configure button and ensure your target host and port are listed.
-   **Option 2 - ✅ Recommended**: Install the Chrome Extension NIM (Node Inspector Manager):[https://chrome.google.com/webstore/detail/nim-node-inspector-manage/gnhhdgbaldcilmgcpfddgdbkhjohddkj](https://chrome.google.com/webstore/detail/nim-node-inspector-manage/gnhhdgbaldcilmgcpfddgdbkhjohddkj)

#### [Visual Studio Code](https://github.com/microsoft/vscode)  [1.10+](https://nodejs.org/en/docs/guides/debugging-getting-started/#visual-studio-code-1-10)

- In the Debug panel, click the settings icon to open  `.vscode/launch.json`. Select "Node.js" for initial setup.
- 📌 You must tell vscode the target debugging port, otherwise vscode will try to debug Yoshi's main process in random generated port, so add `"port" : 9229` (or the port you choose)
 - Example launch.json -

```json
 {
 "name": "Run Tests",
 "type": "node",
 "request": "launch",
 "args" : ["test", "--debug"],
 "port": 9229,
 "program": "${workspaceFolder}/node_modules/.bin/yoshi"
 }
```

#### [JetBrains WebStorm](https://www.jetbrains.com/webstorm/)  [2017.1+ and other JetBrains IDEs](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)
- Create a new Node.js debug configuration
![image description](./assets/debug.png)
- In order to manually tell WebStorm the debugging port, create another configuration, use type 'Attach to Node.js/Chrome'
![image description](./assets/remotedebug.png)
- Press debug in order to start the remote debugger configuration then start (without debugging) the 'Node.js' configuration
