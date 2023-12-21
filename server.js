// app.js

const { sequelize } = require('./techedision-assignment/config/db');
const express = require('express');
const authRoutes = require('./techedision-assignment/routes/authRoutes');
const bookRoutes = require('./techedision-assignment/routes/bookRoutes');
const reviewRoutes = require('./techedision-assignment/routes/reviewRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) // Set force to true to drop existing tables and recreate them
    .then(() => {
        console.log('Database and tables synchronized.');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

app.use(express.json());
app.use('/api',[ authRoutes, bookRoutes,reviewRoutes]);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;