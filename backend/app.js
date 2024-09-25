const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 直接在代碼中定義 JWT 密鑰
const JWT_SECRET = '123456789'; // 更換為強隨機密鑰
const MONGO_URI = 'mongodb://root:1qaz2wsx@mongo:27017/clockdb?authSource=admin'; // 更換為你的MongoDB連接字串

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 打卡記錄 Schema
const clockSchema = new mongoose.Schema({
    user: String,
    time: Date,
    type: { type: String, enum: ['clock-in', 'clock-out'] }
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
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            // 返回錯誤消息
            return res.status(401).json({ message: '用戶名或密碼錯誤。' }); // 401 Unauthorized
        }
    } catch (error) {
        console.error('登入錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡進
app.post('/api/clock-in', authenticateJWT, async (req, res) => {
    try {
        const record = new ClockRecord({ user: req.user.id, time: new Date(), type: 'clock-in' });
        await record.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('打卡進錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡出
app.post('/api/clock-out', authenticateJWT, async (req, res) => {
    try {
        const record = new ClockRecord({ user: req.user.id, time: new Date(), type: 'clock-out' });
        await record.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('打卡出錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 查詢打卡記錄
app.get('/api/records', authenticateJWT, async (req, res) => {
    try {
        const records = await ClockRecord.find();
        res.json(records);
    } catch (error) {
        console.error('查詢打卡記錄錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// JWT 驗證中間件
function authenticateJWT(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // 403 Forbidden
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // 401 Unauthorized
    }
}

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
