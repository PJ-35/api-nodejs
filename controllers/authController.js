const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

const saltRounds = 10;


exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //chercher un utilisateur à fonction de son email
    const utilisateurTrouve = await User.findOne({ email: email });

    //Si un utilisateur est trouvé
    if (utilisateurTrouve) {

     await bcrypt.compare(password, utilisateurTrouve.password)
     .then(result => {
    if (result) {
      
      const token = jwt.sign(
        {
          // Payload
          id:utilisateurTrouve.id,
          isValet:utilisateurTrouve.isValet,
        },
        config.SECRET_JWT,
        { expiresIn: '1h' }
      );
     res.location("/user/" + utilisateurTrouve.id);
      res.status(201).json({token:token});
    }
    })
    }else{
          //Si l'utilisateur n'est pas trouvé
    const erreur = new Error('Courriel ou mot de passe invalide !');
    erreur.statusCode = 400;
    throw erreur;
    }

  } catch (error) {
    next(error);

  }

};


exports.signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;
  try {

    if(password===""){
      const erreur = new Error('Le mot de passe est requis');
      erreur.statusCode = 400;
      throw erreur;
    }

    //Si les mots de passe sont différents
    if(password!==confirmPassword){
      const erreur = new Error('Les mots de passe ne sont pas identique');
      erreur.statusCode = 400;
      throw erreur;
    }
    
    let mdpHache=""
   await bcrypt.hash(password, saltRounds)
  .then(hash => {
    mdpHache=hash
  })

    // Crée un nouveau user avec les informations du body
    const newuser = new User({
      email:email,
      username:username,
      password:mdpHache,
    });
    
    // Enregistre l'utilisateur dans la base de données
    const result = await newuser.save();
    
    // Retourne le résultat au format JSON ainsi que la location 
    res.location("/user/" + result.id);
    res.status(201).json(newuser);

  } catch (err) {
    next(err);
  }

};

