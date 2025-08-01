require('dotenv').config({ path: 'example.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes/index'); // Importa las rutas de usuarios desde el directorio routes
const { sequelize } = require('./models');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");
const path = require('path');
const cookieParser = require('cookie-parser');

// Configuración de CORS https://e-commercealrock.onrender.com
/*
const corsOptions = {
  origin: 'https://e-commercealrock.onrender.com', // Reemplaza con la URL de tu frontend
  //origin: 'http://localhost:3001', // Reemplaza con la URL de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permite incluir credenciales en la solicitud
};
*/

// Middleware para parsear cookies
app.use(cookieParser());

const corsOptions = {
  origin: ['https://e-commercealrock.onrender.com', 'http://localhost:3001'], // Lista de orígenes permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' https://apis.google.com; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline';");
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});



// Import Passport config
require("./config/passport");


console.log(process.env.SESSION_SECRET );
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'una_cadena_secreta_y_unica',
    saveUninitialized: false,
    resave: false,
    cookie: { 
      maxAge: 172800000,
      httpOnly: true,
      sameSite: 'lax', // Permite el envío en contextos de terceros
      secure: true // Asegura que las cookies solo se envíen a través de HTTPS
     },
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
  //console.log(req.session); // Imprime el objeto de sesión

  const user = req.user ;
  console.log("userId:",user)
  console.log(req.userId); // Imprime el objeto de sesión
  res.send('¡Bienvenido a la aplicación    !');
});

app.get('/set-cookie', (req, res) => {
  res.cookie('test_cookie', 'test_value');
  res.send('Cookie has been set');
});

app.get('/check-cookie', (req, res) => {
  console.log('Cookies:', req.cookies);
  res.send('Check your console for cookies');
});




// Montar los enrutadores en las rutas específicas
app.use('/users', routes.userRouter);
app.use('/product', routes.productRouter);
app.use('/order', routes.orderRouter);
app.use('/cart', routes.cartRouter);
//app.use('/', routes.authRouter);
app.use('/', routes.authRouter); // Asegúrate de que authRouter esté correctamente definido en tu objeto routes
app.use('/', routes.paymentRouter); 



sequelize.sync().then(() => {
 
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
});
