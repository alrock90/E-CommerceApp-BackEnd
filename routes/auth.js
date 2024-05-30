
const { Router } = require('express');
const { models } = require('../models');
const router = Router();
//const passport = require('passport');

const passport = require('../config/passport'); // Ruta correcta al archivo passport.js
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");





const register = async (req, res) => {
  const { name, email, telefon, password } = req.body;

  try {
    const user = await models.Users.findOne({ where: { name: name } });
    console.log(`user no existe ${user}`);
    if (user) {
      console.log("User already exists!");
      return res.redirect("login");
    }

    console.log(`user no existe ${user}`);
    // Hash password before storing in local DB:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new Cart
    const newCart = await models.Cart.create();
    console.log("new Cart's auto-generated ID:", JSON.stringify(newCart.id));

    // Create a new user
    try {
      const newUser = await models.Users.create({
        name: name,
        email: email,
        telefon: telefon,
        password: hashedPassword,
        cartId: newCart.id
      });
      console.log("new user's auto-generated ID:", JSON.stringify(newUser.id));
      res.status(201).send(`User added with ID: ${newUser.id}`);


      //res.redirect("login");
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }


  } catch (err) {
    console.log("first error")
    res.status(500).json({ message: err.message });
  }
};



router.post('/login', (req, res, next) => {
  console.log('Body de la solicitud:', req.body);

  passport.authenticate('local', (err, user, info) => {
      if (err) {
          console.error('Error durante la autenticación:', err);
          return next(err);
      }
      if (!user) {
          console.log('Usuario no encontrado');
          return res.redirect('/badlogin');
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error('Error durante la sesión:', err);
              return next(err);
          }
          console.log('Usuario autenticado:', user);
          //return res.redirect('/goodlogin');
          return res.status(200).json({ success: true, message: 'Login exitoso', user: { id: user.id, name: user.name, email: user.email, cartId: user.cartId } });
      });
  })(req, res, next);
});




router.get('/badlogin', (req, res) => {
  res.send("bad login")
  console.log("bad login");
});

router.get('/goodlogin', (req, res) => {
  res.send("all ok")
});


// Log out user:
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect("/"); // Redirecciona incluso si hay un error en el logout
    }
    res.redirect("/");
  });
});


router.post('/register', register);



module.exports = router;