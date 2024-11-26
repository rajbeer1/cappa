const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const dataReadingRoutes = require('./routes/dataReadingRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const crashedRoutes = require('./routes/crashedRoutes');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb+srv://royu49:Rajbeer11@cluster0pa.av8la.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0pa',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/readings', dataReadingRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/crashes', crashedRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
