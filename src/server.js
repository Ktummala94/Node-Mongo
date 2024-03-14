const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const Product = require('./product');
const swaggerSpec = require('./swagger');
const api = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(api);

app.listen(PORT, () => {
  console.log(`Server port ${PORT}`);
});
