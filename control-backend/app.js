const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 連接 MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 公告 Schema
const announcementSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// 發佈公告
app.post('/api/announcements', async (req, res) => {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.sendStatus(201);
});

// 查詢公告
app.get('/api/announcements', async (req, res) => {
    const announcements = await Announcement.find();
    res.json(announcements);
});

// 新增控制台頁面路由
app.get('/control', (req, res) => {
    res.sendFile(__dirname + '/control.html');  // 假設你有一個 control.html 作為後台管理頁面
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Control backend is running on port ${PORT}`);
});
