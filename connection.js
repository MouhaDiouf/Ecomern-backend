require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.s11qz.mongodb.net/ecomern?retryWrites=true&w=majority`;

mongoose.connect(connectionStr, { useNewUrlParser: true }).
then((data)=> console.log('connected to mongodb')).
catch(error => console.log(error));


// handling errors once connection is established
mongoose.connection.on('error', err => {
  console.log(err);
});
