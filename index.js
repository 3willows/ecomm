const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products'); 

const app = express();

app.use(express.static('public'));
app.use(cookieSession({
  keys: ['asdfsadfsadf']
}));

app.listen(3000, () => {
  console.log('nodemon is listening!');
})

app.use(authRouter);
app.use(productsRouter);
