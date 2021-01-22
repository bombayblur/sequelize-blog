var express = require('express');
var router = express.Router();
const db = require('../models/index');


router.get('/', async function(req, res, next) {
    let allTags = await db.Tag.findAll({
        include:[db.User]
    })
    res.json(allTags.toJSON());
});


router.get('/:tagId', async function(req, res, next) {
    let tagId = req.params.tagId;
    let tagModel = await db.Tag.findOne({
        where:{
            id:tagId
        },
        include:[db.User]
    })
    res.json(tagModel.toJSON());
});


router.get('/user/:userId', async function(req, res, next) {
    let userId = req.params.userId;
    let tagModel = await db.Tag.findOne({
        where:{
            UserId:userId
        },
        include:[db.User]
    })
    res.json(tagModel.toJSON()); 
});  
  

router.put('/:tagId', async (req,res,next)=>{
    let tagId = req.params.tagId;
    let tagText = req.body.text;
    let tagModel = await db.Tag.findOne({
        where:{
            id:tagId
        },
        include:[db.User]
    })
    tagModel.text = tagText;
    tagModel = await tagModel.save();
    tagModel = tagModel.toJSON();
    tagModel.warning = "No security implemented"
    res.json(tagModel);
})


router.delete('/:tagId', async (req,res,next)=>{
    let tagId = req.params.tagId;

    let tag = await db.Tag.findOne({
        where: {
            id:tagId
        }
    });

    await tag.destroy();
    res.send(tag.toJSON());
})



module.exports = router;