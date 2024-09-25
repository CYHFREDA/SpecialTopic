const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // 加密用戶密碼
const jwt = require('jsonwebtoken'); // 用於生成和驗證 JSON Web Token

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
            // 使用 JSON Web Token 生成 token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.sendStatus(401); // 401 Unauthorized
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
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
