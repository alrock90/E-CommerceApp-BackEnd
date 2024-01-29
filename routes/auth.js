
const { Router } = require('express');
const { models } = require('../models');
const router = Router();
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


console.log(models);




const register = async (req, res) => {
  const { name, email, telefon, password } = req.body;

  const user = await findByUsername(name);
  try {

    console.log(`user no existe ${user}`);
    if (user) {
      console.log("User already exists!");
      return res.redirect("login");
    }

    console.log(`user no existe ${user}`);
    // Hash password before storing in local DB:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    try {
      const newUser = await models.Users.create({ name: name, email: email, telefon: telefon, password: hashedPassword });
      console.log("new user's auto-generated ID:", JSON.stringify(newUser.id));
      res.status(201).send(`User added with ID: ${JSON.stringify(newUser.id)}`);

      res.redirect("login");
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* router.post('/login', passport.authenticate('local', {
  successRedirect: '/goodlogin',
  failureRedirect: '/badlogin'
}), function(req, res){  // Cambiado de (res, req) a (req, res)
  res.status(201).send("all ok")
  console.log("passport user", req.user);
}); */

/*  router.post(
   "/login",
   passport.authenticate("local", { failureRedirect: "/badlogin" }),
   (req, res) => {
     res.redirect("./goodlogin");
   }
 );
  */

// En el enrutador
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/badlogin' }),
  function (req, res) {
    console.log('Estado de autenticación:', req.isAuthenticated());

    res.redirect('/goodlogin');
    // Intenta una redirección manual
    //res.status(302).json({ redirect: '/goodlogin' });
  });




router.get('/badlogin', (req, res) => {
  res.send("bad login")
  console.log("bad login");
});

router.get('/goodlogin', (req, res) => {

  console.log("passport user", req.user);

  
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
//router.post('/login', login);
//router.get('/logout', logout);



module.exports = router;