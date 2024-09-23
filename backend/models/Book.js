const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// 使用 mongoose.models 来避免重定义模型
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = Book;
