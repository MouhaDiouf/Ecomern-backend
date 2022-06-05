const router = require('express').Router();
const User = require('../models/userModel');
const Order = require('../models/OrderModel');

// signup

router.post('/signup', async (req, res)=> {
  const { name, email, password} = req.body;
  try {
    const user = await User.create({name, email, password});
    res.json(user);
  } catch (e) {
    if(e.code === 11000) return res.status(400).send('Email already exists')
    res.status(400).send(e.message)
  }
})

// login
router.post('/login', async (req, res)=> {
  const {email, password} = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.json(user);
  } catch (e) {
    res.status(400).send(e.message)
  }
});


// get users
router.get('/', async(req, res)=> {
  try {
    const users = await User.find({isAdmin: false}).populate('orders')
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message)

  }
});

// get user orders
router.get('/:id/orders', async(req, res)=>{
  const {id} = req.params;
  try {
    const user = await User.findById(id).populate('orders')
    res.json(user.orders)
  } catch (e) {
    res.status(400).send(e.message)
  }

})

// update users notifs
router.post('/:id/updateNotifications', async(req, res)=> {
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = 'read'
    });
    user.markModified('notifications');
    await user.save();
    res.status(200).send()
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message)
  }
})


//delete many users (one or many)
router.delete('/:id', async(req, res)=> {
  const  {client_id} = req.params;
  const {current_user_id} = req.body;
  console.log(req.body);
  try {
    const currentUser = await User.findById(current_user_id)
    if (!currentUser.isAdmin) res.status(401).json("You don't have the permission."); 
    await User.findByIdAndDelete(id);
    const users = await User.find({isAdmin: false}).populate('orders')
    res.status(200).json(users)
  } catch (e) {
    res.status(400).send(e.message)
  }
})


module.exports = router;
