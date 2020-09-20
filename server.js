const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const sequelize = require('./utils/database');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
// const Product = require('./models/product');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', shopRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

const runServer = async () => {
  await sequelize.sync();

  app.listen(PORT, console.log(`Server running on ${PORT}`));
};

runServer();
