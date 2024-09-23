const express = require('express');
const User = require('../models/User'); // 需要創建用戶模型
const Book = require('../models/Book'); // 需要創建書籍模型
const router = express.Router();
const jwt = require('jsonwebtoken');

// 註冊路由
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password }); // 使用密碼哈希化
    await user.save();
    res.json({ message: 'User registered' });
});

// 登入路由
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && user.password === password) { // 應使用密碼哈希驗證
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// 獲取書籍列表路由
router.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

module.exports = router;
