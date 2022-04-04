const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes')
const cors = require('cors');
require('./connection.js');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes)
app.listen(8080, ()=> {
  console.log('server running at port', 8080 )
})
