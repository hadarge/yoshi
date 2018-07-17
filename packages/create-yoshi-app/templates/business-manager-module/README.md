# {%projectName%}

## Installation
**Detailed explanations are available [here](https://github.com/wix-private/business-manager/blob/master/docs/step-by-step.md#integrate-your-app-into-business-manager)**
```shell
npm install
npm start
Open http://localhost:5000/business-manager/3fdba72b-c9e7-4529-9219-807ad4b36d91/{%projectName%}
```
- If needed update your **[json.erb file](templates/module_{%projectName%}.json.erb)**
- If needed update [module, page component and lazy component ids](src/config.js)
- GA your project
- PR your module config file to business manager as explained [here](https://github.com/wix-private/business-manager/blob/master/docs/module-config-file.md#file-name-and-location)
- Wait for business manager GA
- See it in production
