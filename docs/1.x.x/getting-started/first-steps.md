# First steps

Please read introduction before start this little tutorial.

## First model - Sequelize option

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

## Calls to the API

Start your app:

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
