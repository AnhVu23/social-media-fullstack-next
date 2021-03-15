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

exports.deletePost = async (req, res) => {
    if (req.isPoster) {
        await Post.findOneAndDelete({
            _id: req.post._id
        })
        return res.status(204)
    }
    return res.status(403).json('Forbidden')
}

exports.getPostById = async (req, res, next, id) => {
    const post = await Post.findOne({_id: id})
    req.post = post
    const posterId = mongoose.Types.ObjectId(req.post.postedBy._id)
    if (req.user && posterId.equals(req.user._id)) {
        req.isPoster = true
        return next()
    }
    next()
}

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

exports.toggleLike = async (req, res) => {
    const {postId} = req.body
    const post = await Post.findOne({_id: postId})
    const likeIds = post.likes.map(id => id.toString())
    const userId = req.user._id.toString()
    if (likeIds.includes(userId)) {
        await post.likes.pull(userId)
    } else {
        await post.likes.push(userId)
    }
    await post.save()
    return res.json(post)
}

exports.toggleComment = async (req, res) => {
    const {postId, comment} = req.body
    let operator
    let data
    if (req.url.includes('uncomment')) {
        operator = '$pull'
        data = {
            _id: comment._id
        }
    } else {
        operator = '$push'
        data = {
            text: comment.text,
            postedBy: req.user._id
        }
    }
    const updatedPost = await Post.findOneAndUpdate({
        _id: postId
    }, {
        [operator]: {comments: data}
    }, {
        new: true
    })
        .populate('postedBy', '_id name avatar')
        .populate('comments.postedBy', '_id name avatar')
   return res.json(updatedPost)
}
