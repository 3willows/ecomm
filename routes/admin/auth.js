const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/signup');
const signInTemplate = require('../../views/admin/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signUpTemplate({req}));
})

router.post('/signup',
[
  check('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .custom(async (email) =>{
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser){
      throw new Error ('Email in use');
    }
  }),
  check('password')
  .trim()
  .isLength({min: 4, max: 20}),
  check('passwordConfirmation')
  .trim()
  .isLength({min: 4, max: 20})
  .custom((passwordConfirmation, {req}) => {
    if (passwordConfirmation !== req.body.password){
      throw new Error ('passwords must match');
    }
  })
]
, async (req, res) => {
  const errors = validationResult(req);
  console.log(errors)
  const { email, password, passwordConfirmation } = req.body;

  const user = await usersRepo.create({ email, password });
  req.session.userId = user.id;
  res.send("account created")
})

router.get('/signout', (req, res) => {
  req.session = null;
  res.send("you're logged out")
})

router.get('/signin', (req, res) => {
  res.send(signInTemplate());
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send(`no such person try again`);
  }

  const correctPassword = await usersRepo.comparePasswords(user.password, password)

  if (!correctPassword) {
    return res.send(`wrong password try again`);
  }

  return res.send(`you are signed in`)
})

module.exports = router;