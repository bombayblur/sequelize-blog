

module.exports = (sequelize, DataTypes)=>{
    let User =  sequelize.define('User', {
        id:{
          type:DataTypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
          
        },
        firstName:{
          type:DataTypes.STRING,
          allowNull:false,
          primaryKey:false
        },
        lastName:{
          type:DataTypes.STRING,
          allowNull:false,
          primaryKey:false
        }
      },{
          timestamps:true
        }
  )

  User.associate = (model)=>{
    User.hasMany(model.Blog);
    User.hasMany(model.Tag);
  }

  return User;
}