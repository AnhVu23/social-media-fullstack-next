const multer = require('multer')
const jimp = require('jimp')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')

const imageUploadOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: (req, file, next) => {
        if (file.mimeType.startsWith('image/')) {
            return next(null, true)
        }
        return next(null, false)
    }
}

exports.uploadImage = multer(imageUploadOptions).single('image')

exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next()
    }
    const extension = req.file.mimeType.split('/')[1]
    req.body.image = `/static/upload/images/${req.user.name}-${Date.now()}/${extension}`
    const image = await jimp.read(req.file.buffer)
    await image.resize(750, jimp.AUTO)
    await image.write(`${req.body.image}`)
    next()
};

exports.addPost = async (req, res, next) => {
    req.body.postedBy = req.user._id
    const post = await new Post(req.body).save()
    await Post.populate(post, {
        path: 'postedBy',
        select: '_id name avatar'
    })
    return res.json(post)
}

exports.deletePost = () => {};

exports.getPostById = () => {};

exports.getPostsByUser = async (req, res, next) => {
    const posts = await Post.find({postedBy: req.profile._id})
        .sort({
            createdAt: 'desc'
        })
    return res.json(posts)
}

exports.getPostFeed = async (req, res, next) => {
    const {following, _id} = req.profile
    following.push(_id)
    const posts = await Post.find({
        postedBy: {
            $in: following
        }
    }).sort({
        createdAt: 'desc'
    })
    return res.json(posts)
}

exports.toggleLike = () => {};

exports.toggleComment = () => {};
