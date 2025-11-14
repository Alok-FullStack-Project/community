require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const villageRoutes = require('./routes/village');
const eventRoutes = require('./routes/event');
const Advertise = require('./routes/advertise');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/family', require('./routes/family'));
app.use("/api/family-member", require('./routes/FamilyMember'));
app.use('/api/villages', require('./routes/village'));
app.use('/api/events', require('./routes/event'));
app.use('/api/advertise', require('./routes/advertise'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
