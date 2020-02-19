# Queries

## Use simple case

TODO

## With Neatsio Querier

```javascript
const Querier = require('@owliehq/querier')

const requestFormatted = Querier
  .query({resultsPerPage: 20, baseUrl: '/users'})
  .select('lastname')
  .rawConditions({
    firstname: {
      $or: ['John', 'Jane']
    }
  })
  .sortDesc('lastname')
  .page(2)
  .generate()

const results = await axios.get(requestFormatted).then(response => response.data)
```
