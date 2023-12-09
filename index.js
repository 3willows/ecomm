const express = require('express');

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

app.post('/', (req, res) =>{
  req.on('data', data => {
    console.log(typeof data);
    console.log(data);
     
    const parsed = data.toString('utf8').split('&');
    const formData = {};
    for (let pair of parsed){
      const [key, value] = pair.split('=');
      formData[key] = value
    }
    console.log(formData);
  })
  res.send("Account created!")
})

app.listen(3000, () => {
  console.log('nodemon is listening!');
})