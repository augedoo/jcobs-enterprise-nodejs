const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(cors());
// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  // const user = await User.findOne();
  const user = await User.findOne({ where: { id: 1 } });
  if (user) {
    req.user = user;
  }
  next();
});

app.use('/', shopRoutes);
app.use('/admin', adminRoutes);
app.use(errorController.get404);

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

(async () => {
  try {
    // Create User if none exist
    // let user = await User.findOne();
    let user = await User.findOne({ where: { id: 1 } });
    if (!user) {
      user = await User.create({
        name: 'augedoo-test',
        email: 'augedoo@test.com',
      });
    }
    // Create Cart if none exist
    let cart = await user.getCart();
    if (!cart) {
      cart = await user.createCart();
    }

    // const result = await sequelize.sync({ force: true });
    const result = await sequelize.sync();
    app.listen(PORT, console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
})();
