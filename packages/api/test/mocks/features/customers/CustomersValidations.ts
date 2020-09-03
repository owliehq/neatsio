import { body } from 'express-validator'

export const validationsCreateOne = [
  body('lastname')
    .isString()
    .trim()
    .isLength({ min: 2 }),
  body('firstname')
    .isString()
    .trim()
    .isLength({ min: 2 })
]
