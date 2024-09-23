const express = require('express');
const app = express();
app.use(express.json());

// 註冊路由
app.post('/api/register', async (req, res) => {
    // 註冊邏輯
    res.send('User registered'); // 測試用回應
});

// 登入路由
app.post('/api/login', async (req, res) => {
    // 登入邏輯
    res.send('User logged in'); // 測試用回應
});

// 獲取書籍列表路由
app.get('/api/books', async (req, res) => {
    // 獲取書籍邏輯
    res.json([]); // 測試用回應，返回空陣列
});

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
