const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: process.env.FRONT_END_LINK,
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
}
);

const User = require('./models/userModel');
const Order = require('./models/OrderModel');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const imagesRoutes = require('./routes/imagesRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');
const PORT = 8080;
require('./connection.js');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imagesRoutes);


app.post('/create-payment', async (req, res)=> {
  const {amount} = req.body;
  try {
      const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message)
  }

})

server.listen(process.env.PORT || PORT, ()=> {
  console.log('listening to port', PORT)
})

app.set('socketio', io);
