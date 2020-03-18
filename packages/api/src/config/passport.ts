import { ExtractJwt, Strategy } from 'passport-jwt'

export const JwtPassportStrategy = (params: any): Strategy => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: params.secret
  }

  return new Strategy(options, async (token, done) => {
    try {
      const user = await params.getUser(token.id)
      if (user) return done(null, user)

      done(null, false)
    } catch (err) {
      done(err, false, { message: 'Internal Server Error' })
    }
  })
}
