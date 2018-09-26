---
id: momentjs-optimization
title: Moment.js optimization
sidebar_label: Moment.js optimization
---

If you require `moment.js` in your client-side code `webpack` will put all of `moment.js`'s locale files into your bundle (over 90 different locales). This causes a significant bundle increase and it's usually unnecessary.

To avoid it, a require to `moment.js` will only load `moment.js` without any locales. If you need to have some of its locales, you can require them yourself like that:

```js
const moment = require('moment');
require('moment/locale/ja');

moment.locale('ja');
...
```

You can read more about it here: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack/blob/master/README.md
