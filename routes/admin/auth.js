const express = require('express');
const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/signup');
const signInTemplate = require('../../views/admin/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signUpTemplate({req}));
})

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must macth');
  }

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  console.log(req.session.userId);

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