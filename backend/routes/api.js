const express = require('express');
const app = express();
app.use(express.json());

// 註冊路由
app.post('/api/register', async (req, res) => {
    // 註冊邏輯（假設成功）
    // 你可以在這裡加入實際的註冊邏輯
    res.json({ message: 'User registered' }); // 返回有效的 JSON
});

// 登入路由
app.post('/api/login', async (req, res) => {
    // 登入邏輯（假設成功）
    // 你可以在這裡加入實際的登入邏輯
    res.json({ token: 'your-jwt-token', message: 'User logged in' }); // 返回有效的 JSON
});

// 獲取書籍列表路由
app.get('/api/books', async (req, res) => {
    // 獲取書籍邏輯
    res.json([]); // 返回空陣列作為測試
});

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
