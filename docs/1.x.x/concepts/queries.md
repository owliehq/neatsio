# Queries

## Use simple case

TODO

## With Neatsio Querier

```javascript
const Querier = require('@owliehq/querier')

// Start the query
let requestFormatted = Querier.query({ resultsPerPage: 20, baseUrl: '/users' })

// Select only lastname, can be called many times
requestFormatted = requestFormatted.select('lastname')
  
// Apply conditions to the request
requestFormatted = requestFormatted.rawConditions({
  firstname: {
    $or: ['John', 'Jane']
  }
})

// Add sorting condition by lastname DESC
requestFormatted = requestFormatted.sortDesc('lastname')

// Return only entries on page 2
requestFormatted = requestFormatted.page(2)

requestFormatted = requestFormatted.generate()

const results = await axios.get(requestFormatted).then(response => response.data)
```

Previous example works in chaining options:

```javascript
const url = Querier.query({ resultsPerPage: 20, baseUrl: '/users' })
  .select('lastname')
  .select('firstname')
  .sortDesc('lastname')
  .page(2)
  .rawConditions({
    firstname: {
      $or: ['John', 'Jane']
    }
  })
  .generate()
```

### All chaining methods

All queries must start by: `Querier.query()` or `Querier.query(options)` (with options set).

| Name | Params | Description | Example |
| ---- | ------- | ---------- | ------- |
| **`.select`** | `{string}` attributes separated by space character | Restrict results to fields passed as params | `.select('lastname')` |
| **`.sort`** | `{string}` attributes separated by space character ("-" behind equals to DESC sorting) | Sort results by attributed passed as params | `.sort('firstname')` or `.sort('-firstname')` |
| **`.sortDesc`** | `{string}` idem force | Sort results by attributed passed as params | `.sortDesc('firstname')` |
| **`.limit`** | `{number}` number of items to get | Limit the result to param | `.limit(10)` |
| **`.skip`** | `{number}` number of items to skip | Skip x results | `.skip(20)` |
| **`.page`** | `{number}` page | Return result at specified page limited by `resultsPerPage` attribute set to `query()` | `.page(2)` |
| **`.rawConditions`** | `{object}` Neatsio conditions object | Return results match with conditions | `.rawConditions({ firstame: 'John' })`
