module.exports = (sequelize, DataTypes)=>{
    let Tag = sequelize.define('Tag', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        }, 
        text:{
            type:DataTypes.STRING,
            allowNull:false
        }
    });

    Tag.associate = (model)=>{
        Tag.belongsToMany(model.Blog, {through: 'BlogTag'});
        Tag.belongsTo(model.User);
    }

    return Tag;
}