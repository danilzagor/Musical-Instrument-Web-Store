const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const guitarsRouter = require('./routes/guitars');
const drumsRouter = require('./routes/drums');
const pianosRouter = require('./routes/pianos');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/guitars', guitarsRouter);
app.use('/drums', drumsRouter);
app.use('/pianos', pianosRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);


const PORT =  3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
