const express = require('express');
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users.js');
const cookieSession = require('cookie-session');
// app is the object we will be modified

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['asdfsadfsadf']
}))

// add route handler
// req is info from users.  Res is info from server from use.
app.get('/signup', (req, res) => {
  res.send(`
  <div>
  your id is: ${req.session.userId}
    <form method="POST">
      <input name ="email" placeholder="email" />
      <input name ="password" placeholder="password" />
      <input name= "passwordConfirmation"placeholder="password confirm" />
      <button>Sign up</button>
    </form>
  </div>
  `);
})

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
  req.session = null;
  res.send("you're logged out")
})

app.get('/signin', (req, res) => {
  res.send(`<div>
    <form method="POST">
    <h> SIGN IN PAGE </h> <br>
    <input name ="email" placeholder="email" />
      <input name ="password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>`);
})

app.post('/signin', async (req, res) => {
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

app.listen(3000, () => {
  console.log('nodemon is listening!');
})