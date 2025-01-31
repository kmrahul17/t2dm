const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://rahul02bunny:rahul02bunny@cluster0.9eusm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api/users', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});