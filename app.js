const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
require('./passport');

dotenv.config();

const mongoDB = process.env.DATABASE_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const passport = require('passport');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client/build')));
app.use(compression());
app.use(helmet());

app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/posts', passport.authenticate('jwt', { session: false }), postRouter);
app.use('/posts/:post_id/comments', passport.authenticate('jwt', { session: false }), commentRouter);

module.exports = app;
