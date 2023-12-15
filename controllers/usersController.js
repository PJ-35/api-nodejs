const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const url_base = config.URL + ":" + config.PORT;


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });
    console.log(users)
    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const users = await checkUserExists(userId);
    const userss = users.map(user => {
      return {
        ...user._doc,
        _links: [{
          delete: 
          {method:'DELETE',
           href: url_base+req.url
           }
        }
        ]
      };
    })

    res.status(200).json({
      user: userss
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Récupérez l'ID de l'utilisateur depuis les paramètres de la requête
    const userId = req.params.userId;
    let updateData={}
    const user=await checkUserExists(userId)
    if(user.isValet){
      const { email, username, price } = req.body;
      updateData={email,username,price}
    }else{
      const { email, username } = req.body;
      updateData={email,username}
    }
  
    // Utilisez findByIdAndUpdate pour mettre à jour l'utilisateur par son ID
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    
    if (!updatedUser) {
      const error = new Error('Aucun utilisateur trouvé pour la mise à jour !');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
 }

exports.updateCar = async (req, res, next) => {
  try{
    const userId = req.params.userId;
    //const user=await User.findById(postId)
    
    const user = await checkUserExists(userId);

    if (!user) {
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    }
    const { marque,modele,couleur,plaque } = req.body;
    if(user.voiture){
      if(req.body.isMoving){
        const valetid = req.get('Authorization');
        const valet=await checkUserExists(valetid)
        if(valetid && valet && valet.isValet){
          const histo=new Histo({
            price:valet.price,
            isPaid:false,
            userId:userId,
            valetId:valetid
          })
          await histo.save()
        }else{
          const error=new Error('Pas d\' id de valet présent dans la requête')
          error.statusCode=400
          throw error
        }

      }
      //const updatedCar = await Voiture.findByIdAndUpdate(user.voiture.id, { marque,modele,couleur,plaque }, { new: true, runValidators: true });
     
      const updatedCar = await Voiture.findByIdAndUpdate(user.voiture.id, req.body, { new: true, runValidators: true });
          if (!updatedCar) {
            const error = new Error('Aucune voiture trouvé pour la mise à jour !');
            error.statusCode = 404;
            throw error;
          }
          res.status(200).json({update:user.voiture});
  
    }
    else{
      const newCar = new Voiture({
        marque:marque,
        modele:modele,
        couleur:couleur,
        plaque:plaque
      });
      const result = await newCar.save();
      //user.voiture=result.id
      await User.findByIdAndUpdate(userId, {"voiture":result.id}, { new: true, runValidators: true });
      res.status(200).json({creation:result});
    }


  }catch (err) {
    next(err);
  }

 }



exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await checkUserExists(userId);
    console.log(userId)
    await user.deleteOne();
    if (user.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      await voiture.deleteOne();
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}