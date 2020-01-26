# Neatsio REST

[![Dependencies](https://david-dm.org/owliehq/neatsio/status.svg?path=packages/rest)](https://david-dm.org/owliehq/neatsio?path=packages/rest) [![Coverage Status](https://coveralls.io/repos/github/neatsio/rest/badge.svg?branch=master)](https://coveralls.io/github/neatsio/rest?branch=master)

When using Neatsio REST lib, you can create REST APIs in seconds. Built on top of ExpressJS, Neatsio REST removes your boilerplate work time. Focus on models and business logic, the lib generate automatically endpoints based on mongoose/sequelize schemas. Save your time and enjoy with your new REST routes.

This lib is opinionated, some features or development orientation are due to personal choices, but PR are welcome.

<p align="center">
  <img src="https://i.imgur.com/UomzozV.png">
</p>

## Features

- CRUD endpoints generated from Mongoose (partially) or Sequelize schema
- Support of query paramaters to handle filtering, pagination, sorting, and sub-populating
- Handle express middlewares
- Hooks
- Customs routes
- Written in typescript

## Getting Started

### 1. Install Neatsio REST

```
$ npm install --save @owliehq/neatsio
$ npm install --save express body-parser sequelize

[OPTIONAL FOR TESTING]
$ npm install --save sqlite3
```

### 2. Basic usage (give it a try)

```js
const express = require('express')
const bodyParser = require('body-parser')
const neatsioRest = require('@owliehq/neatsio')
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/database.sqlite',
  logging: false
})

// Init your sequelize models
class User extends Sequelize.Model {}
User.init(
  {
    firstname: { type: Sequelize.DataTypes.STRING, allowNull: false },
    lastname: { type: Sequelize.DataTypes.STRING, allowNull: false },
    email: { type: Sequelize.DataTypes.STRING, allowNull: false }
  },
  {
    sequelize,
    modelName: 'user'
  }
)

const app = express()

// Register your model
neatsioRest.registerModel(User)

// Bodyparsing is needed to handle payloads on POST / PUT routes
app.use(bodyParser.json())

// Neatsio brings to you an express router
app.use('/api', neatsioRest.routes)

sequelize.authenticate().then(() => {
  User.sync().then(() => {
    app.listen(3000, () => {
      console.log('Neatsio REST API started on port 3000!')
    })
  })
})
```

### Start server

```
$ node app.js
```

### Make calls to your API

```
# Get all users (empty)
GET http://localhost:3000/api/users

# Create an user
POST http://localhost:3000/api/users

# Get user by ID
GET http://localhost:3000/api/users/1

# Get user's lastname by ID
GET http://localhost:3000/api/users/1?$select=lastname

# Get users lastname order by email DESC
GET http://localhost:3000/api/users?$select=lastname&sort=-email

# Get users populated with embed models with conditions
GET http://localhost:3000/api/users?$populate=posts.comments&$conditions={"$or":[{"$email:"john@acme.com"},{"id":2}]}

# Update user
PUT http://localhost:3000/api/users/1

# Delete user
DELETE http://localhost:3000/api/users/1

# Create in bulk
POST http://localhost:3000/api/users/bulk

# Update in bulk with conditions
PUT http://localhost:3000/api/users/bulk?$conditions={"active":false}
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
