# Introduction

Neatsio expose an express router which build automatically routes from yours Sequelize/Mongoose models (new ODM/ORM implementations are currently at study stage).

It uses and is written in Typescript, but also can be used on pure JS. Some extensions are available (http errors, async, ...)

Neatsio's purpose is to eliminate boilerplate code when you're editing a CRUD API based on models. Some query helpers are bring to you to avoid writing hundreds lines of code with no real value. See queries section.

## First installation

To play with Neatsio, you're invited to create or start with an express environment project. If you have no idea how to complete this first step, please take a look at [Express documentation](https://expressjs.com/en/starter/hello-world.html) before continue here.

We need to install and prepare lib :

```sh
$ npm install --save @owliehq/neatsio
```

Then, retrieve your express starter or express application :

#### **`app.js`**
```javascript
const express = require('express')
const neatsio = require('@owliehq/neatsio')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Apply neatsio router on custom route or at root level (not recommended)
app.use('/api', neatsio.routes)

app.listen(3000, () => {
  console.log('API listen on port 3000')
})
```

At this moment, you don't have set or configure any model to Neatsio, so Neatsio doesn't bring any routes to your API. We need to start with a first model.

#### **`models/user.js`**
```javascript
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const User = sequelize.define('User', {
  pseudo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {})

module.exports = User
```

Re-open your main file app, and modify/add lines:

#### **`app.js`**
```javascript

const User = require('./models/user.js')

neatsio.registerModel(User)

app.use('/api', neatsio.routes)

app.listen(3000, () => {
  console.log('API listen on port 3000')
})
```

Then, start your app :

```sh
$ node app.js
```

Open your HTTP Request maker tool (eg. Postman), and try these calls:

```
GET http://localhost:3000/api/users
// Must return empty array: []

POST http://localhost:3000/api/users
// With JSON object in body : { "pseudo": "DOE, John DOE", "email": "john@acme.com" }

GET http://localhost:3000/api/users
// Must return array with one entry, juste
```

Check that **all your requests must return status code 2xx**. If not, there is maybe an error with your express code or sequelize configuration, please check.

Congratulations, you have implemented and configured your first model with Neatsio!
