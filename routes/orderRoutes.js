const router = require('express').Router();
const Order = require('../models/OrderModel');
const User = require('../models/userModel');
const {Schema} = require('mongoose')

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}


router.post('/', async(req, res)=> {
  const io = req.app.get('socketio');
  const {userId, cart, country, address} = req.body;
  try {
    const user = await User.findById(userId);
    const orderCount = cart.count;
    const orderTotal = cart.total;
    const order = await Order.create({owner: user._id, products: cart, country, address});
    order.count = orderCount;
    order.total = orderTotal;
    await order.save();
    user.cart = {total: 0, count: 0};
    user.orders.push(order);
    const date = formatDate(new Date());
    io.sockets.emit("ordercreated");
    const notification =  {status: 'unread', message: `New order from ${user.name}`, time: date}
    io.sockets.emit("new-order", notification);
    user.markModified('orders');
    await user.save();
    await res.status(200).json(user)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

  router.get('/', async(req, res)=> {
    const io = req.app.get('socketio');
    try {
      const orders = await Order.find().populate('owner',['email', 'name'])
      res.status(200).json(orders);
    } catch (e) {
      res.status(400).json(e);
    }
  })

router.get('/:id', async (req, res)=> {
  const {id} = req.params;
  try {
    const order = await Order.findById(id);
    const orderProducts = order.products;
    delete orderProducts.total;
    delete orderProducts.count;
    res.status(200).json(orderProducts);
  } catch (e) {
    res.status(400).json(e.message)
  }
});

router.patch('/:id/mark-shipped', async(req, res) => {
  const {ownerId} = req.body;
  var io = req.app.get('socketio');
  const {id} = req.params;
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, {status: 'shipped'});
    const orders = await Order.find().populate('owner',['email', 'name'])
    const date = formatDate(new Date());
    const notification =  {status: 'unread', message: `Order ${id} shipped with success`, time: date}
    io.sockets.emit("notification", notification, ownerId);
    user.notifications.push(notification);
    await user.save();
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e.message);
  }
});


  module.exports = router;
