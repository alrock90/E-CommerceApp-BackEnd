const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config({ path: 'example.env' });


const routes = require('./routes/index'); // Importa las rutas de usuarios desde el directorio routes
const { sequelize, models } = require('./models');



app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la aplicación    !');
});
// Montar los enrutadores en las rutas específicas
app.use('/users', routes.userRouter);


sequelize.sync().then(() => {
 
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
});

/*
//const userRoutes = require('./routes/users');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Montar los enrutadores en las rutas específicas
app.use('/users', routes.userRouter);





// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la aplicación!');
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

*/
// Ruta principal
