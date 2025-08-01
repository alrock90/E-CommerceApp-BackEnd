
const { Router } = require('express');
const { models } = require('../models');
const router = Router();
//const passport = require('passport');

const passport = require('../config/passport'); // Ruta correcta al archivo passport.js
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET_TOKEN;
//const callbackFrontend = process.env.CALLBACKURLFRONT || 'https://e-commercealrock.onrender.com';
const callbackFrontend = process.env.CALLBACKURLFRONT || 'vacio';
console.log("callbackFrontendtest:" + callbackFrontend)
console.log("callbackFrontendtest:" + process.env.CALLBACKURLFRONT)



const register = async (req, res) => {
  const { name, email, telefon, password, role } = req.body;

  try {
    const user = await models.Users.findOne({ where: { email: email } });
    console.log(`user no existe ${user}`);
    if (user) {
      console.log("User already exists!");
      //return res.redirect("login");
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    if (role != 'user' && role != 'store') {
      role = 'user'
    }

    console.log(`user no existe ${user}`);
    // Hash password before storing in local DB:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let newCart;
    // Create a new Cart
    if (role === 'user') {
       newCart = await models.Cart.create();
      console.log("new Cart's auto-generated ID:", JSON.stringify(newCart.id));
    } else{
       newCart= ''
    }
    // Create a new user
    try {
      const newUser = await models.Users.create({
        name: name,
        email: email,
        telefon: telefon,
        password: hashedPassword,
        cartId: newCart.id,
        role: role
      });
      console.log("new user's auto-generated ID:", JSON.stringify(newUser.id));
      //res.status(201).send(`User added with ID: ${newUser.id}`);
      //res.status(201).json({ success: true, userId: newUser.id });
      return res.status(200).json({ success: true, message: 'Login successful', id: newUser.id, name: newUser.name, email: newUser.email, cartId: newUser.cartId, role: newUser.role });


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

//local login

router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error durante la autenticación:', err);
      return next(err);
    }
    if (!user) {
      console.log('Usuario no encontrado');
      //return res.redirect('/badlogin');
      return res.status(401).json({ success: false, message: 'Login failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error durante la sesión:', err);
        return next(err);
      }
      console.log('Usuario autenticado:', user);
      // Generar un token JWT
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, cartId: user.cartId, role: user.role }, secretKey, { expiresIn: '1h' });

      // Configurar la cookie con el token
      res.cookie('session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3600000 // 1 hora
      });

      return res.status(200).json({ success: true, message: 'Login successful', id: user.id, name: user.name, email: user.email, cartId: user.cartId, role: user.role });
    });
  })(req, res, next);
});

// Autenticación con Google// Autenticación con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
    console.log("entre a passport auth")
    if (err) {
      console.error('Error durante la autenticación:', err);
      return next(err);
    }
    if (!user) {
      console.log('Usuario no autenticado');
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error durante la sesión:', err);
        return next(err);
      }
      console.log('Usuario autenticado:', user);
      // Generar un token JWT
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, cartId: user.cartId, role: user.role }, secretKey, { expiresIn: '1h' });

      // Configurar la cookie con el token
      res.cookie('session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3600000 // 1 hora
      });

      // Redirige al frontend con el token en la query string
      res.redirect(`${callbackFrontend}/auth/loginUserWithGoogle?token=${token}`);
      //res.redirect(`http://localhost:3001/auth/loginUserWithGoogle?token=${token}`);

    });
  })(req, res, next);
});





//To delete

router.get('/badlogin', (req, res) => {
  res.send("bad login")
  console.log("bad login");
});

router.get('/goodlogin', (req, res) => {
  res.send("all ok")
});


// Modifica la ruta de logout para usar req.logout() correctamente
router.get("/logout", (req, res) => {
  console.log("logout");

  const user = req.user;
  console.log("userId:", user)
  console.log(req.userId); // Imprime el objeto de sesión

  req.logout((err) => { // Proporciona una función de devolución de llamada
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    // Clear the session_token cookie by setting it to an expired date
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });


    res.status(200).json({ success: true, message: "Logout successful" });
  });
});



router.post('/register', register);



module.exports = router;