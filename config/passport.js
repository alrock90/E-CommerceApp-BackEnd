const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");
const { sequelize, models } = require('../models');


console.log("users model:")
console.log(models.Users)

passport.use(new LocalStrategy({
  usernameField: 'email', // especifica que el campo de usuario es 'email'
  passwordField: 'password' // campo de contraseña sigue siendo 'password'
}, async (email, password, done) => {
  try {
    process.nextTick(async () => {
      console.log("entre")
      console.log(email)
      console.log(password)
      const usuario = await models.Users.findOne({ where: { email: email } });
      console.log(usuario.id)
      console.log(usuario)
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

    });
  } catch (error) {
    return done(error);
  }
}));

//google auth strategy

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

// Estrategia Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACKURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await models.Users.findOne({ where: { id: profile.id } });
    if (!user) {

      // Create a new Cart
      const newCart = await models.Cart.create();
      console.log("new Cart's auto-generated ID:", JSON.stringify(newCart.id));

      user = await models.Users.create({
        //googleId: profile.id,
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        cartId: newCart.id
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
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






module.exports = passport;