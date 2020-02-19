# Queries

## Use simple case

TODO

## With Neatsio Querier

```javascript
const Querier = require('@owliehq/querier')

const query = Querier
  .query({resultsPerPage: 20})
  .select('lastname')
  .rawConditions({
    firstname: {
      $or: ['John', 'Jane']
    }
  })
  .sortDesc('lastname')
  .page(2)
  .generate()
```
