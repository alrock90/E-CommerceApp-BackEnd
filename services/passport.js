const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const models = require("../models");

// Set up the Passport strategy:

passport.use(
  new LocalStrategy(function (username, password, cb) {
    findByUsername(username, async function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(null, false);

      const matchedPassword = await bcrypt.compare(password, user.password);

      if (!matchedPassword) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);
// Serialize a user

passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Deserialize a user

passport.deserializeUser((id, done) => {
  findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});


const findByUsername = async (username, callBackUserfounded) => {
  
        try {
            const search = await models.Users.findAll({
                where: {
                  name: username
                }
              });
              
        } catch (error) {
            callBackUserfounded(true,false); //error
        }       
      
        if (userById === null) {
            callBackUserfounded(false,false);      //user no encontrado
        } else {
            callBackUserfounded(false,search);        //user encontrado
        }  
     
};

const findById = async (id, callbackIdFounded) => {
    try{
        const userById = await models.Users.findByPk(id);
    } catch(error){
        callbackIdFounded(true, false);
    }
    callbackIdFounded(true, userById);

}

