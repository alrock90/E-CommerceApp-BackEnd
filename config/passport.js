const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { sequelize, models } = require('../models');


console.log("users model:")
console.log(models.Users)
/* 
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("entre");

      // Utilizar findOne para buscar el usuario directamente
      const user = await models.Users.findOne({ where: { name: username } });

      console.log("entre a async fun");

      console.error(user);

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const matchedPassword = await bcrypt.compare(password, user.password);

      console.error("matchedPassword");
      console.error(matchedPassword);
      if (!matchedPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  })
); */
/* 
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      console.log("entre a LocalStrategy");

      const user = await models.Users.findOne({ where: { name: username } });

      if (!user) {
        console.log("Usuario no encontrado");
        return cb(null, false, { message: 'Usuario no encontrado' });
      }

      const matchedPassword = await bcrypt.compare(password, user.password);

      if (!matchedPassword) {
        console.log("Contraseña incorrecta");
        return cb(null, false, { message: 'Contraseña incorrecta' });
      }

      console.log("Usuario autenticado correctamente");
      return cb(null, user, { message: 'Login exitoso' });
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      return cb(error);
    }
  })
); */

/* passport.use(new LocalStrategy(
  async (username, password, done) => {
    models.Users.findOne({ username: username }, async (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      const matchedPassword = await bcrypt.compare(password, user.password);
      if (!matchedPassword) { return done(null, false); }
      return done(null, user);
    });
  }
)); */


passport.use(new LocalStrategy({
  usernameField: 'email', // especifica que el campo de usuario es 'email'
  passwordField: 'password' // campo de contraseña sigue siendo 'password'
},async (email, password, done) => {
  try {
    console.log("entre")
    console.log(email)
    console.log(password)
    const usuario = await models.Users.findOne({ where: { email: email } });
    console.log(usuario.id)
    if (!usuario) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    try {
      const match = await bcrypt.compare(password, usuario.password);
      if (match) {
        console.log("user correcto")
        return done(null, usuario);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      return done(error);
    }


  } catch (error) {
    return done(error);
  }
}));




// Serialize a user

passport.serializeUser((user, done) => {
  console.log("entre serializeUser")
  done(null, user.id);
});

// Deserialize a user
passport.deserializeUser(async (id, done) => {
  try {
    console.log("entre deserializeUser", id)
    const user = await models.Users.findByPk(id);
    done(null, user);

  } catch (err) {
    return done(err);
  }
});



/* const findByUsername = async (username, callBackUserfounded) => {
  try {
      const search = await models.Users.findOne({
          where: {
              name: username
          }
      });

      if (!search) {
          callBackUserfounded(null, false); // Usuario no encontrado
          console.log("usuario no encontrado 1");
      } else {
          callBackUserfounded(null, search); // Usuario encontrado
          console.log("usuario encontrado 1");
      }
  } catch (error) {
      callBackUserfounded(error, false); // Error en la búsqueda
  }
}; */






module.exports = passport;