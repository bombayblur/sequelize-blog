
module.exports = (sequelize, DataTypes)=>{
    let Blog = sequelize.define('Blog', {
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

    Blog.associate = (model)=>{
        Blog.belongsTo(model.User);
        Blog.belongsToMany(model.Tag, {through:'BlogTag'});
    }

    return Blog;
}