const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 5001;

// 連接 MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// 定義打卡資料模型
const clockSchema = new mongoose.Schema({
  user: String,
  clockIn: Date,
  clockOut: Date
});

const Clock = mongoose.model('Clock', clockSchema);

// 打卡路由
app.use(express.json());

app.post('/clock-in', async (req, res) => {
  const clockInData = new Clock({
    user: req.body.user,
    clockIn: new Date(),
    clockOut: null
  });
  await clockInData.save();
  res.send('Clocked in successfully');
});

app.post('/clock-out', async (req, res) => {
  const clockOutData = await Clock.findOneAndUpdate(
    { user: req.body.user, clockOut: null },
    { clockOut: new Date() }
  );
  res.send('Clocked out successfully');
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
