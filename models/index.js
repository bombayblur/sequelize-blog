'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const util = require('util');
const debug = util.debuglog('learn-sql:models');
const db = {};

let sequelize = new Sequelize('saurabsalhotra', 'saurabsalhotra', null, {
  host:'localhost',
  dialect: 'postgres'
});

// This piece of code reads your models folder and activates each model and also
// runs the association fucntion. You could do all this manually too !!
//
//
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


//This piece of code finds all the associations and then runs them.
//
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

async function testAndSyncDb(){
  try {
    await sequelize.authenticate();
    debug('Connection has been established successfully.');
  } catch (error) {
    debug('Unable to connect to the database:', error);
  }

  try{
    await sequelize.sync({alter:true});
    debug('All models synced');
  } catch (err) {
    debug('Error while syncing database' + err);
  }
};

testAndSyncDb();

module.exports = db;
