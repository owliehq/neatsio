# Async-Wrapper

## Getting Started

### 1. Install Async wrapper request handler

```
$ npm install express
$ npm install @owliehq/async-wrapper
```

### 2. Basic usage (give it a try)

```js
const express = require('express')
const asyncWrapper = require('@owliehq/async-wrapper')

const app = express()

const route = async (req, res) => {
  const data = await fetchSomeData()
  res.status(200).json(data)
}

app.get('/route', asyncWrapper(route))

app.listen(3000, () => {
  console.log('Express serve with async/await support!')
})
```

### Start server

```
$ node app.js
```

## Getting Support

- Check out GitHub issues opened, send us an mail
- To file a bug: create a GitHub issue on this repo. Be sure to include details about how to replicate it.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License

Copyright (c) 2019

Licensed under [MIT](https://choosealicense.com/licenses/mit/)
