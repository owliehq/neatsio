# First steps

## Requirement

Please read introduction before starting.

## First model - Sequelize option

At this moment, you didn't configure any model in Neatsio, so Neatsio can't provide any route to your API. For that, we need to implement the first model.

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

Re-open the main file and modify/add lines:

#### **`app.js`**
```javascript
const User = require('./models/user.js')

neatsio.registerModel(User)

app.use('/api', neatsio.routes)

app.listen(3000, () => {
  console.log('API listen on port 3000')
})
```

## Make your API calls

Start your app:

```sh
$ node app.js
```

Use any HTTP Request tool (eg. [Postman](https://www.postman.com/)), and try making calls:

```
GET http://localhost:3000/api/users
// Must return empty array: []

POST http://localhost:3000/api/users
// With JSON object in body : { "pseudo": "DOE, John DOE", "email": "john@acme.com" }

GET http://localhost:3000/api/users
// Must return array with one entry
```

**Each API calls must return a 2xx status code**. If it's not the case, there is probably an error with your Express or Sequelize configuration.

Congrats, you have implemented and configured your first model with Neatsio !
