const express = require('express');

// app is the object we will be modified

const app = express();

// add route handler
// req is info from users.  Res is info from server from use.
app.get('/', (req, res) =>{
  res.send('hi there');
})

app.listen(3000, ()=> {
  console.log('Listening');
})