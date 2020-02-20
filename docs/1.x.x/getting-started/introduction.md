# Introduction

Neatsio exposes an express router automatically creating routes from your Sequelize/Mongoose models (other ODM/ORM implementations are currently in study stage).

It uses and is written in Typescript, but also can be used on pure JS. Some extensions are available (http errors, async, ...).

The purpose of Neatsio is to avoid the user writing boilerplate code when creating a CRUD API based on models. 

Query helpers are provided by Neatsio to help developers, avoiding them writing low value-added lines of code (details at the <a href="../../concepts/queries/">queries section</a>)

Some query helpers are brought to you to avoid writing hundreds lines of code with no real value. See queries section.

## Requirements

Neatsio is actually based on ExpressJS which is itself based on Node.JS. We recommend using minimum `Node 10`, better on LTS `Node 12`.

It is required to work with an available databases with Neatsio. In fact you'll have to connect your Sequelize/Mongoose models to it. It's important to keep this in mind.

Using **Sequelize** (v5.x), Neatsio supports:
- SQLite **`>= 3.0`**
- MySQL **`>= 5.6`**
- MariaDB **`>= 10.1`**
- PostgreSQL **`>= 10`**
- MsSQL **`TDS >= 7.4`**

Using **Mongoose** (v5.x), Neatsio supports:
- MongoDB **`>= 3.4`**

`/!\ Disclaimer: NOT ALL METHODS ARE YET IMPLEMENTED WITH MONGOOSE.`

## Installation

In order to start using Neatsio, you're have to create an express environment project or start with an existing one. If you don't know what we are writing about, please take a look at the [Express documentation](https://expressjs.com/en/starter/hello-world.html) before following the upcoming part.

Firstable, you need to add the library to your project :

```sh
$ npm install --save @owliehq/neatsio
```

Then, retrieve your express instance :

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

You can now access the following route : **`GET /api/users`**. For now, the server will only respond with an empty array because there's no data in your database.
