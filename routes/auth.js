
const { Router } = require('express');
const { models } = require('../models');
const router = Router();
const passport = require("passport");
const bcrypt = require("bcrypt");


const findByUsername = async (name) => {  
        const search = await models.Users.findAll({
            where: {
              name: name
            }
          });  
    if (search != null) {
        return(search.id);
    }   
};

  

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
      try{
        const newUser = await models.Users.create({ name: name, email: email, telefon: telefon, password: hashedPassword });  
        console.log("new user's auto-generated ID:",  JSON.stringify(newUser.id));
        res.status(201).send(`User added with ID: ${ JSON.stringify(newUser.id)}`);
       
        res.redirect("login");
      } catch(error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      
     
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

    // Log In User:
    
    const login = async (req, res) => {        
        passport.authenticate("local", { failureRedirect: "/login" }),  (req, res) => {
        res.redirect("../");
        }
    };

    // Log out user:
    const logout = (req, res) => {
        req.logout();
        res.redirect("../");
    };



router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);



module.exports = router;