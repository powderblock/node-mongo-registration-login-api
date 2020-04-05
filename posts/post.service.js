const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Post = db.Post;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Post.find().select('-hash');
}

async function getById(id) {
    return await Post.findById(id).select('-hash');
}

async function create(userParam) {

    const post = new Post(userParam);
    post.author = "BLADE";
    post.tags = "yolo, code, diet coke";
    post.id = "123ABC";

    // save user
    await post.save();
}

async function update(id, userParam) {
    const user = await Post.findById(id);

    // validate
    if (!user) throw 'Post not found';
    if (user.username !== userParam.username && await Post.findOne({ username: userParam.username })) {
        throw 'Postname "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await Post.findByIdAndRemove(id);
}
