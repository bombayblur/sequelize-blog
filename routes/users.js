var express = require('express');
var router = express.Router();
const db = require('../models/index');

// The object that we will be dealing with is a simple USER[firstname, lastname, id]

router.get('/', async function(req, res, next) {
  let userId = req.query.id;

  let response;
  try {
    let user = await db.User.findOne({
      where: {
        id:userId
      }
    });
    response = user.toJSON();
  } catch(err){
    response = {error: 'Could not fetch User'};
  }
  res.send(response);
});



router.post('/', async (req,res,next)=>{
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  let user = await db.User.create({
    firstName:firstName,
    lastName:lastName
  })

  res.send(user.toJSON());

})

router.put('/', async (req,res,next)=>{
  let userId = req.query.id;

  let user = await db.User.findOne({
    where: {
      id:userId
    }
  });

  req.body.firstName ? user.firstName = req.body.firstName : null ;
  req.body.lastName ? user.lastName = req.body.lastName : null ;

  await user.save();
  res.send(user.toJSON());

})

router.delete('/', async (req,res,next)=>{
  let userId = req.query.id;

  let user = await db.User.findOne({
    where: {
      id:userId
    }
  });

  await user.destroy();
  res.send(user.toJSON());


})

module.exports = router;
