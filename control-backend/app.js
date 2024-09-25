const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // 引入 path 模組以便處理路徑

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 連接 MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 公告 Schema
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// 發佈公告
app.post('/control/api/announcements', async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        res.sendStatus(201); // 201 Created
    } catch (error) {
        console.error('發佈公告錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 查詢公告
app.get('/control/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.json(announcements);
    } catch (error) {
        console.error('查詢公告錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 刪除公告
app.delete('/control/api/announcements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Announcement.findByIdAndDelete(id);
        if (result) {
            res.sendStatus(204); // 204 No Content
        } else {
            res.sendStatus(404); // 404 Not Found
        }
    } catch (error) {
        console.error('刪除公告錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 新增控制台頁面路由
app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'control.html')); // 使用 path.join 確保正確的路徑
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Control backend is running on port ${PORT}`);
});
