import * as passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import User from '../features/users/User'
/**
 *
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'abc'
}

/**
 *
 */
export const tokenStrategy = new Strategy(options, async (token, done) => {
  try {
    //
    const user = await User.findByPk(token.id)

    console.log(user)

    //
    if (user) return done(null, user)

    done(null, false)
  } catch (err) {
    done(err, false, { message: 'Internal Server Error' })
  }
})
