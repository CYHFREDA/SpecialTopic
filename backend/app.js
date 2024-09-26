require('dotenv').config(); // 加載環境變數

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 使用環境變數來讀取 MongoDB 連接字串
const MONGO_URI = process.env.MONGO_URI; // 確保 MONGO_URI 被加載

mongoose.set('strictQuery', true);
// 連接 MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 連接成功'))
    .catch(err => console.error('MongoDB 連接錯誤:', err));

// 打卡記錄 Schema
const clockSchema = new mongoose.Schema({
    user: String,
    time: Date,
    type: { type: String, enum: ['上班打卡', '下班打卡'] }
});

const ClockRecord = mongoose.model('ClockRecord', clockSchema);

// 用戶 Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 註冊新用戶
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查用戶是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用戶名已被佔用。' }); // 400 Bad Request
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.sendStatus(201); // 201 Created
    } catch (error) {
        console.error('註冊錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 登入
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            // 登入成功，不需要返回 JWT
            res.json({ message: '登入成功' });
        } else {
            return res.status(401).json({ message: '用戶名或密碼錯誤。' }); // 401 Unauthorized
        }
    } catch (error) {
        console.error('登入錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡上班
app.post('/api/clock-in', async (req, res) => {
    try {
        const { username } = req.body; // 獲取用戶名稱
        if (!username) {
            return res.status(400).json({ message: '缺少用戶名稱' }); // 400 Bad Request
        }
        
        // 查找用戶以確認其存在
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' }); // 404 Not Found
        }

        const record = new ClockRecord({ user: username, time: new Date(), type: 'clock-in' });
        await record.save();
        res.sendStatus(200); // 200 OK
    } catch (error) {
        console.error('打卡上班錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡下班
app.post('/api/clock-out', async (req, res) => {
    try {
        const { username } = req.body; // 獲取用戶名稱
        if (!username) {
            return res.status(400).json({ message: '缺少用戶名稱' }); // 400 Bad Request
        }

         // 查找用戶以確認其存在
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' }); // 404 Not Found
        }

        const record = new ClockRecord({ user: username, time: new Date(), type: 'clock-out' });
        await record.save();
        res.sendStatus(200); // 200 OK
    } catch (error) {
        console.error('打卡下班錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 查詢打卡記錄
app.get('/api/records', async (req, res) => {
    try {
        const records = await ClockRecord.find();
        res.json(records);
    } catch (error) {
        console.error('查詢打卡記錄錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 刪除打卡記錄
app.delete('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ClockRecord.findByIdAndDelete(id);
        if (result) {
            res.sendStatus(204); // 204 No Content
        } else {
            res.sendStatus(404); // 404 Not Found
        }
    } catch (error) {
        console.error('刪除打卡紀錄錯誤:', error);
        res.status(500).json({ error: '刪除打卡紀錄時發生錯誤。' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
