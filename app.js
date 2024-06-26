const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const historiqueRoutes = require('./routes/historique');
const config = require('./config');
const errorController = require('./controllers/errorController');
const seed = require("./routes/db");



const app = express();
const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL;

// parse application/json
app.use(express.json());  

// remplace le res.json standard avec la nouvelle version
// qui prend en charge les liens HATEOAS
app.use(hateoasLinker); 


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



// Utilisation des routes en tant que middleware
app.use('/auth', authRoutes);
app.use(userRoutes);
app.use(historiqueRoutes);
app.use(seed);


// Gestion erreur 404, ce middleware doit être le dernier
app.use(errorController.get404);

// Gestion des erreurs, ce middleware gère seulement les erreurs qui sont générées par le code
app.use(errorController.getErrors);


mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', PORT);
    });
  })
  .catch(err => console.log(err));

 module.exports = app;
