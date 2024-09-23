const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // 密碼應該哈希化
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
