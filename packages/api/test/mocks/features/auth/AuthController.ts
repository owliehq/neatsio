import { Controller, Post, Body } from '../../../../src'
import User from '../users/User'
import { HttpError } from '@owliehq/http-errors'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

@Controller('auth')
export default class AuthController {
  @Post('/login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) throw HttpError.Unauthorized(`No user found with this email.`)

    const { id, password: hashPassword } = user

    const isSamePassword = bcrypt.compareSync(password, hashPassword)

    //
    if (!isSamePassword) throw HttpError.Unauthorized(`Invalid credentials.`)

    const { accessToken } = await AuthController.createLoginTokens(email, id)

    return { accessToken }
  }

  /**
   *
   * @param email
   * @param id
   */
  private static async createLoginTokens(email: string, id: number): Promise<any> {
    // When all is good, create user's access token
    const accessToken = jwt.sign({ email, id }, 'abc', {
      expiresIn: '7d'
    })

    return {
      accessToken
    }
  }
}
