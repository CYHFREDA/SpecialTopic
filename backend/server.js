const express = require('express');
const app = express();
const apiRoutes = require('./routes/api'); // 引入 API 路由

app.use(express.json()); // 解析 JSON 請求體

// 使用 API 路由
app.use('/api', apiRoutes); // 所有 /api 的請求都會轉發到 apiRoutes

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
