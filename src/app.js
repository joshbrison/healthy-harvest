const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const diagnoseRouter = require('./routes/diagnose');
const indexRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes

app.use('/', indexRouter);
app.use('/api/diagnose', diagnoseRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
