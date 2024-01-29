require('dotenv').config({ path: 'example.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes/index'); // Importa las rutas de usuarios desde el directorio routes
const { sequelize, models } = require('./models');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");

const path = require('path');




// Import Passport config
require("./config/passport");


console.log(process.env.SESSION_SECRET );
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'una_cadena_secreta_y_unica',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 172800000 },
  })
);



// Passport Config
app.use(passport.initialize());
app.use(passport.session());

//Bodyparser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  console.log(req.session); // Imprime el objeto de sesión
  console.log(req.user); // Imprime el objeto de sesión
  res.send('¡Bienvenido a la aplicación    !');
});



// Montar los enrutadores en las rutas específicas
app.use('/users', routes.userRouter);
app.use('/product', routes.productRouter);
app.use('/order', routes.orderRouter);
app.use('/', routes.authRouter);


sequelize.sync().then(() => {
 
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
});
