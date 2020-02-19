# Models

With Neatsio, you need to create Models from [Sequelize](https://sequelize.org/v5/) or [Mongoose](https://mongoosejs.com/docs/guide.html). In the future, we want this project, interoperable with [TypeORM](https://typeorm.io/), [Bookshelf](https://bookshelfjs.org/) or [Objection.js](https://vincit.github.io/objection.js/) (for example).

A model is defined by its attributes & relations with others models. Neatsio help you to expose entities on your API without many configuration.

To create or instanciate your first model, please refer you to the right documentation according to the ORM selected.

## Connect model to Neatsio

A simple call is needed:

```javascript
const User = require('./models/user')

neatsio.registerModel(User)

// Apply router after register models
app.use('/', neatsio.routes)
```

And [endpoints](/1.x.x/concepts/endpoints) are automatically built.

## Options

Example:

```javascript
const userOptions = {
  // {optional} Apply custom routes (see doc)
  routes: [],

  // {optional} Apply middlewares to each type of endpoint, all are optional
  middlewares: {
    before: [(req, res, next) => { next() }, ...],
    after: [(req, res, next) => { next() }, ...],
    getOne: [(req, res, next) => { next() }, ...],
    getMany: [(req, res, next) => { next() }, ...],
    createOne: [(req, res, next) => { next() }, ...],
    createBulk: [(req, res, next) => { next() }, ...],
    updateOne: [(req, res, next) => { next() }, ...],
    updateDelete: [(req, res, next) => { next() }, ...],
    before: [(req, res, next) => { next() }, ...]
  },

  // {optional} Remove fields from response returning entity/entities
  hiddenAttributes: ['lastTimePasswordChanged']
}

const User = require('./models/user')

neatsio.registerModel(User, userOptions)

app.use('/', neatsio.routes)
```
