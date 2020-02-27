# First model: creating & connecting

Let's create our first model !

## Model with Sequelize (Typescript variant)

In this example, we'll create a model based on Sequelize, using Typescript. This section is not directly related to Neatsio but it can be useful :

### Related libraries

```
  npm install --save sequelize
  npm install --save sequelize-typescript
```
Once you have installed these libraries, you are now able to create your model.
Let's create a User model:

#### **`models/user.js`**
```typescript
// import our libs
import { DataTypes } from 'sequelize'
import {
  AllowNull,
  BeforeSave,
  Column,
  Default,
  ForeignKey,
  Unique
} from 'sequelize-typescript'

//create the User model class
class User extends Model<User> {
  @Column
  firstname: string

  @Column
  lastname: string

  @AllowNull(false)
  @Unique
  @Column
  email: string

  @Default(0)
  @Column
  likes: number

  @Column
  @AllowNull
  address: string

  @AllowNull(false)
  @Default(new Date())
  @Column
  lastEmailChanged: Date

  // A User can have à User ref as manager (Neatsio will let you populate this field !)
  @ForeignKey(() => User)
  managerId: number
}

```
You can create a more complex model, using [Sequelize documentation](https://sequelize.org/v5/) and [Sequelize-Typescript decorators](https://github.com/RobinBuschmann/sequelize-typescript).
