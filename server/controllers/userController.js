const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.getUsers = async (req, res, next) => {
    const users = await User.find().select('_id name email createdAt updatedAt')
    res.json(users)
}

exports.getAuthUser = async (req, res,) => {
    if (!req.isAuthUser) {
        res.status(403).json({
            message: 'You are unauthenticated'
        })
        return res.redirect('/signin')
    } else {
        return res.json(req.user)
    }

}

exports.getUserById = async (req, res, next, id) => {
    req.profile = await User.findOne({_id: id})

    const profileId = mongoose.Types.ObjectId(req.profile._id)
    if (profileId.equals(req.user._id)) {
        req.isAuthUser = true
        return next()
    }
    next()
}

exports.getUserProfile = async (req, res) => {
    if (!req.profile) {
        return res.status(404).json({
            message: 'No user found'
        })
    }
    res.json(req.profile)
};

exports.getUserFeed = async (req, res) => {
    const {following, _id} = req.profile
    following.push(_id)
    const users = await User.find({_id: {$nin: following}})
        .select('_id name avatar')
    res.json(users)
}

exports.uploadAvatar = () => {
}

exports.resizeAvatar = () => {
}

exports.updateUser = async (req, res, next) => {
    req.body.updatedAt = new Date().toISOString()
    const user = await User.findByIdAndUpdate({
        _id: req.user._id
    }, {
        $set: req.body
    }, {
        new: true,
        runValidators: true
    })
    return res.json(user)
}

exports.deleteUser = async (req, res) => {
    const {userId} = req.params
    if (req.isAuthUser) {
        await User.findOneAndDelete({_id: userId})
        return res.status(204)
    }
    return res.status(403).message(`Forbidden error`)
}

exports.addFollowing = async (req, res, next) => {
    const {followId} = req.body
    await User.findByIdAndUpdate({
        _id: req.user.id,
    }, {
        $push: {following: followId}
    })
    next()
}

exports.addFollower = async (req, res, next) => {
    const {followId} = req.body
    const user = await User.findByIdAndUpdate({
        _id: followId,
    }, {
        $push: {followers: followId}
    }, {
        new: true
    })
    return res.json(user)
};

exports.deleteFollowing = async (req, res, next) => {
    const {followId} = req.body
    await User.findByIdAndUpdate({
        _id: req.user.id,
    }, {
        $pull: {following: followId}
    })
    next()
}

exports.deleteFollower = async (req, res, next) => {
    const {followId} = req.body
    const user = await User.findByIdAndUpdate({
        _id: followId,
    }, {
        $pull: {followers: followId}
    }, {
        new: true
    })
    return res.json(user)
}
