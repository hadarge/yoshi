# How to debug tests  
This guide will help you get started debugging your tests.
  
## Enable Inspector  
When started with the `--debug` switch, Yoshi will allow to attach NodeJS debugger to the relevant child process with the default host and port.
You can configure the default port by: `--debug=XXXX`    
  
## [Inspector Clients](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients)  
  
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
  
- Create a new Node.js debug configuration with the wantted Yoshi task name   
 - In some cases WebStorm debugger can't auto attach to child process
    - In order to manually tell WebStorm the debugging port create another configuration from type 'Attach to Node.js/Chrome'
    - ![image description](https://preview.ibb.co/mhSnty/Screen_Shot_2018_05_13_at_11_49_48.png)  
 - Example configuration -   
       
![image description](https://preview.ibb.co/cyXbmJ/Screen_Shot_2018_05_13_at_11_49_40.png)  
