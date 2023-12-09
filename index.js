const express = require('express');
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users');
const users = require('./repositories/users');

// app is the object we will be modified

const app = express();

// add route handler
// req is info from users.  Res is info from server from use.
app.get('/', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name ="email" placeholder="email" />
      <input name ="password" placeholder="password" />
      <input name= "passwordConfirmation"placeholder="password confirm" />
      <button>Sign up</button>
    </form>
  </div>
  `);
})

app.post('/', bodyParser.urlencoded({extended: true}), async (req, res) => {
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await usersRepo.getOneBy({email });
  if (existingUser){
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation){
    return res.send('Passwords must macth');
  }
  res.send("account created")
})

app.listen(3000, () => {
  console.log('nodemon is listening!');
})