const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const clockSchema = new mongoose.Schema({
    user: String,
    time: Date,
    type: { type: String, enum: ['clock-in', 'clock-out'] }
});

const ClockRecord = mongoose.model('ClockRecord', clockSchema);

// 打卡進
app.post('/api/clock-in', async (req, res) => {
    const record = new ClockRecord({ user: req.body.user, time: new Date(), type: 'clock-in' });
    await record.save();
    res.sendStatus(200);
});

// 打卡出
app.post('/api/clock-out', async (req, res) => {
    const record = new ClockRecord({ user: req.body.user, time: new Date(), type: 'clock-out' });
    await record.save();
    res.sendStatus(200);
});

// 查詢打卡記錄
app.get('/api/records', async (req, res) => {
    const records = await ClockRecord.find();
    res.json(records);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
