const express = require('express');
const bodyParser = require('body-parser')

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


app.post('/', bodyParser.urlencoded({extended: true}), (req, res) => {
  console.log(req.body);
  res.send("account created")
})


app.listen(3000, () => {
  console.log('nodemon is listening!');
})