const express = require('express');
const router = express.Router();

// 註冊路由
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // 註冊邏輯（例如存儲用戶到數據庫）
    res.json({ message: 'User registered' }); // 確保返回有效的 JSON
});

// 登入路由
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // 登入邏輯（例如檢查用戶名和密碼）
    res.json({ token: 'some_generated_token', message: 'User logged in' }); // 返回有效的 JSON
});

// 獲取書籍列表路由
router.get('/books', async (req, res) => {
    // 獲取書籍邏輯（例如從數據庫中獲取書籍）
    res.json([]); // 返回空陣列作為示範
});

module.exports = router; // 確保導出的是 router
