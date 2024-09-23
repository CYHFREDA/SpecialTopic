const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 連接 MongoDB
mongoose.connect('mongodb://localhost:27017/book-exchange', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const Book = mongoose.model('Book', bookSchema);

// 註冊用戶
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// 登入用戶
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

// 驗證 JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// 發布書籍
app.post('/books', authenticateToken, async (req, res) => {
  const { title, author } = req.body;
  const newBook = new Book({ title, author, owner: req.user.userId });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Book posted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error posting book' });
  }
});

// 查看所有書籍
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('owner', 'username');
  res.json(books);
});

// 請求交換書籍
app.post('/books/request/:id', authenticateToken, async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  if (book.requestedBy) return res.status(400).json({ error: 'Book already requested' });

  book.requestedBy = req.user.userId;
  await book.save();

  res.json({ message: 'Book request sent' });
});

// 使用環境變量設置端口
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
