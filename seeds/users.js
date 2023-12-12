const bcrypt = require('bcryptjs');

const password="123456"

let user=[]

async function hash(){

await bcrypt.hash(password, 10)
.then(hach => {
 user =[
    {
    "_id": "650dade494237ad07eedc7ee",
    "username": "wily",
    "email": "user1@gare.ca",
    "password": hach,
    "voiture":"650e08dc63d222e2c0afc396"
  }, {
    "_id": "650dadf594237ad07eedc7f0",
    "username": "pierre",
    "password": hach,
    "email": "user2@gare.ca",
    "voiture":"650e404b63d222e2c0afc397"
  }, {
    "_id": "650dcaf47bc86e471e5c0af6",
    "username": "junior",
    "password": hach,
    "email": "user3@gare.ca",
    "voiture":"650e404b63d222e2c0afc398"
  },{
    "_id": "650dade494237ad07eedc7e0",
    "username": "ziad",
    "password": hach,
    "email": "user4@gare.ca",
    "voiture":"650e404b63d222e2c0afc399"
  },{
    "_id": "65137c7bd4cd47fd34c45753",
    "username": "affan",
    "password": hach,
    "email": "user5@gare.ca",
    "voiture":"650e404b63d222e2c0afc39a"
  },{
    "_id": "65137c7bd4cd47fd34c45755",
    "username": "valet",
    "password": hach,
    "email": "valet@gare.ca",
    "isValet":true,
    "price":3
  },{
    "_id": "65137c7bd4cd47fd34c45756",
    "username": "user6",
    "password": hach,
    "email": "user6@gare.ca",
    "voiture":"650e404b63d222e2c0afc390"
  }]

})

return user

}

module.exports =  hash