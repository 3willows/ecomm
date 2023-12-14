const express = require('express')
const { validationResult } = require('express-validator')

const bodyParser = require('body-parser')
const usersRepo = require('../../repositories/users')
const signUpTemplate = require('../../views/admin/auth/signup')
const signInTemplate = require('../../views/admin/auth/signin')

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailForSignIn,
  requirePassswordForSignIn
} = require('./validators')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))

const { errorChecker } = require('../../middlewares')

router.get('/signup', (req, res) => {
  res.send(signUpTemplate({}))
})

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  errorChecker(signUpTemplate),
  async (req, res) => {
    const { email, password } = req.body
    const user = await usersRepo.create({ email, password })
    req.session.userId = user.id
    return res.redirect('/signin')
  }
)

router.get('/signout', (req, res) => {
  req.session = null
  res.send("you're logged out")
})

router.get('/signin', (req, res) => {
  res.send(signInTemplate({}))
})

router.post(
  '/signin',
  [requireEmailForSignIn, requirePassswordForSignIn],
  errorChecker(signInTemplate),
  async (req, res) => {
    res.redirect( '/admin/products/new')
  }
)
module.exports = router
