const { check } = require('express-validator')
const usersRepo = require('../../repositories/users')

module.exports = {
  requireTitle: check('title')
  .trim()
  .isLength({min: 5, max: 40}),
  requirePrice: check('price')
  .trim()
  .toFloat()
  .isFloat(),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email })
      if (existingUser) {
        throw new Error('Email in use')
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      const { password } = req.body
      if (!password || password !== passwordConfirmation) {
        throw new Error('Passwords must match')
      } else return true
    })
    .withMessage('error with the custom function'),
  requireEmailForSignIn: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('must be valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email })
      if (!user) {
        throw new Error('Email not found')
      }
    })
    .withMessage('email not found'),
  requirePassswordForSignIn: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const {email} = req.body
      // console.log(email);
      const user = await usersRepo.getOneBy({ email })
      // console.log(user.password)
      if (!user){
        throw new Error('wrong password');
      }
      const passwordValidated = await usersRepo.comparePasswords(user.password, password);
      if (!passwordValidated) {
          throw new Error('wrong password')
      } 
    })
    .withMessage('wrong password')
}
