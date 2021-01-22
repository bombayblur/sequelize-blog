var express = require('express');
var router = express.Router();
const db = require('../models/index');


router.get('/', async function (req, res, next) {

    let listOfBlogModels = await db.Blog.findAll({
        include: [db.User, db.Tag]
    });
    let listOfBlogs = listOfBlogModels.map(blogModel => blogModel.toJSON());

    res.json(listOfBlogs);
});

router.get('/user/:userId', async function (req, res, next) {
    let listOfBlogModels = await db.Blog.findAll({
        where: {
            UserId: req.params.userId // check this
        },
        include: [db.User, db.Tag]
    })
    let listOfBlogs = listOfBlogModels.map(blogModel => blogModel.toJSON());

    res.json(listOfBlogs);
});

router.get('/tags', async function (req, res, next) {

    let tagsToFind = req.query.tags;

    // First Transaction determines the ids that match our conditions
    //
    let blogModels = await db.Blog.findAll({
        include: {
            model: db.Tag,
            where: {
                text: {
                    [db.Op.in]: tagsToFind
                }
            }
        }
    });

    blogModels = blogModels.map(blogModel => blogModel.toJSON());

    // This gives us the complete list of the blogs
    //
    let arrayOfBlogs = blogModels.map(blog=>blog.id);

    blogModels = await db.Blog.findAll({
        where:{
            id:{
                [db.Op.in]:arrayOfBlogs
            }
        }, 
        include:[db.Tag, db.User]
    })

    blogModels = blogModels.map(blogModel=>blogModel.toJSON());

    res.json(blogModels);
});

router.get('/:blogId', async function (req, res, next) {
    let blogModel = await db.Blog.findOne({
        where: {
            id: req.params.blogId
        },
        include: [db.User, db.Tag]
    })
    res.json(blogModel.toJSON());
});

router.post('/', async (req, res, next) => {

    let blogText = req.body.blogText;
    let userId = req.body.userId;
    let tags = req.body.tags; // array

    try {
        let userModel = await db.User.findOne({
            where: {
                id: userId
            }
        });

        if (userModel) {

            let listOfTagModels;
            if (tags.length > 0) {

                // Find or create the tags, this will give you an array of promises.
                //
                let listTagStatus = tags.map((tag) => {
                    return db.Tag.findOrCreate({
                        where: {
                            text: tag
                        },
                        defaults: {
                            text: tag,
                            UserId: userModel.id
                        }
                    });
                });

                // Process the array of promises and then destructure them.
                //
                listOfTagModels = await Promise.all(listTagStatus).then((array) => {
                    return array.map(([item, created]) => item);
                });

            }



            let blogModel = await db.Blog.create({
                text: blogText
            });

            blogModel.setUser(userModel);

            if (listOfTagModels) {
                await blogModel.setTags(listOfTagModels);
            }

            // Find the blog just created with the tags included
            //
            blogModel = await db.Blog.findOne({
                where: {
                    id: blogModel.id
                },
                include: [db.User, db.Tag]
            });

            res.json(blogModel.toJSON());

        } else {
            res.json({
                error: 'No such user found.'
            })
        }
    } catch (err) {
        res.send(err);
    }


    // res.send('TODO: Post a blog')
});


router.put('/:blogId', async (req, res, next) => {

    let userId = req.body.userId;
    let tags = req.body.tags;

    if (req.params.blogId) {

        let userModel = await db.User.findOne({
            where: {
                id: userId
            }
        });

        if (userModel) {

            let listOfTagModels;
            if (tags.length > 0) {

                // Find or create the tags, this will give you an array of promises.
                //
                let listTagStatus = tags.map((tag) => {
                    return db.Tag.findOrCreate({
                        where: {
                            text: tag
                        },
                        defaults: {
                            text: tag,
                            UserId: userModel.id
                        }
                    });
                });

                // Process the array of promises and then destructure them.
                //
                listOfTagModels = await Promise.all(listTagStatus).then((array) => {
                    return array.map(([item, created]) => item);
                });

            }

            let blogModel = await db.Blog.findOne({
                where: {
                    id: req.params.blogId
                }
            });

            if (blogModel) {
                blogModel.text = req.body.text;
                await blogModel.save();
                await blogModel.removeTags();
                await blogModel.setTags(listOfTagModels);

                blogModel = await db.Blog.findOne({
                    where: {
                        id: blogModel.id
                    },
                    include: [db.User, db.Tag]
                })
                res.json(blogModel.toJSON());
            } else {
                res.json({
                    error: 'No such blog found'
                })
            }
        } else {
            res.json({
                error: 'No such user found.'
            })
        }
    } else {
        res.json({
            error: 'No blog Id mentioned'
        })
    }

    // res.send('TODO: Edit a blog by id');
})


router.delete('/:blogId', async (req, res, next) => {
    let blogId = req.params.blogId;

    let blog = await db.Blog.findOne({
        where: {
            id: blogId
        }
    });

    await blog.destroy();
    res.send(blog.toJSON());
})



module.exports = router;