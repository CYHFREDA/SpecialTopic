const express = require('express');
const router = express.Router();

// 註冊路由
router.post('/register', async (req, res) => {
    // 在這裡添加你的註冊邏輯
    res.send('User registered'); // 測試用回應
});

// 登入路由
router.post('/login', async (req, res) => {
    // 在這裡添加你的登入邏輯
    res.send('User logged in'); // 測試用回應
});

// 獲取書籍列表路由
router.get('/books', async (req, res) => {
    // 在這裡添加獲取書籍的邏輯
    res.json([]); // 測試用回應，返回空陣列
});

module.exports = router; // 將路由模組導出
