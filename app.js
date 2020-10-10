const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const colors = require('colors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require('multer');

const sequelize = require('./utils/database');
const errorController = require('./controllers/error');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, '-');
    cb(null, date + '-' + file.originalname);
  },
});

app.set('view engine', 'ejs');
app.set('views', 'views');

colors.enable();
app.use(morgan('dev'));
app.use(cors());
// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      req.user = await User.findOne({ where: { id: req.session.user.id } });
    }
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.user;
  next();
});

app.use('/', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });
Product.belongsTo(User);
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Product.belongsToMany(Order, { through: OrderItem, onDelete: 'CASCADE' });
Order.belongsToMany(Product, { through: OrderItem });

const PORT = process.env.PORT || 5000;

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(PORT, console.log(`Server running on ${PORT}`.yellow.underline));
  })
  .catch((err) => {
    console.log(err);
  });
