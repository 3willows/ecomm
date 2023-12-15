const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsAdminRouter = require('./routes/admin/productsAdmin'); 
const productsPublicRouter = require('./routes/productsPublic'); 

const app = express();

app.use(express.static('public'));
app.use(cookieSession({
  keys: ['asdfsadfsadf']
}));

app.listen(3000, () => {
  console.log('nodemon is listening!');
})

app.use(authRouter);
app.use(productsAdminRouter);
app.use(productsPublicRouter);
