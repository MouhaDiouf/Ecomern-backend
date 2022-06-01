const express = require('express');
const app = express();

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const imagesRoutes = require('./routes/imagesRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');
require('./connection.js');


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes)
app.use('/images', imagesRoutes);
app.use('/orders', orderRoutes);
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

var httpServer = require('http').Server(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// io.on('connection', function (socket) {
//     // socket.emit("order");
// });
app.set('socketio', io);

httpServer.listen(8080, ()=> {
  console.log('server running at port', 8080 )
})
