const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/drag-drop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const imageSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
});

const Image = mongoose.model('Image', imageSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const newImage = new Image({
    fileName: file.filename,
    filePath: file.path,
  });

  await newImage.save();

  res.json({
    message: 'Image uploaded successfully',
    file: file.filename,
    filePath: file.path,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
