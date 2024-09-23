const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const app = express();

app.use(express.json());

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/bookExchange', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 使用 API 路由
app.use('/api', apiRoutes);

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
