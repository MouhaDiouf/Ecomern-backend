const router = require('express').Router();
const Product = require('../models/ProductModel')

router.post('/', async (req, res)=> {
  try {
    const {name, description, price, category, pictures} = req.body;
    const product = await Product.create({name, description, price, category, pictures});
    res.status(201).json(product)
  } catch (e) {
    res.status(400).send(e.message)
  }

});

router.get('/', async (req, res)=> {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


router.get('/:id', async (req, res)=> {
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (e) {
    res.status(400).send(e.message);
  }
});




module.exports = router;
