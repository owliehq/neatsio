# Introduction

Neatsio exposes an express router which build automatically routes from your Sequelize/Mongoose models (new ODM/ORM implementations are currently at study stage).

It uses and is written in Typescript, but also can be used on pure JS. Some extensions are available (http errors, async, ...)

Neatsio's purpose is to eliminate boilerplate code when you're editing a CRUD API based on models. Some query helpers are brought to you to avoid writing hundreds lines of code with no real value. See queries section.

## Requirements

Neatsio works with ExpressJS and Node.JS. We recommend using minimum `Node 10`, better on LTS `Node 12`.

A database is needed with Neatsio, because you will connect your Sequelize/Mongoose models to it. Prepare your environment in this way.

Via **Sequelize** (version 5.x), Neatsio supports:
- SQLite **`>= 3.0`**
- MySQL **`>= 5.6`**
- MariaDB **`>= 10.1`**
- PostgreSQL **`>= 10`**
- MsSQL **`TDS >= 7.4`**

Via **Mongoose** (version 5.x), Neatsio supports:
- MongoDB **`>= 3.4`**
`/!\ Disclamer: All methods are not totally implemented with Mongoose.`

## Installation

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

This is the beginning, you can call the route **`GET /api/users`** but the server must respond an empty array (no data is still in database).
