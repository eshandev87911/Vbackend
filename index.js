const express = require('express');
const cors = require('cors');
const app= express();
const mongoose = require('mongoose');
const todoRoutes = require('./api/todoRoutes');
const userRoutes = require('./api/userRoutes');
const mailRoutes = require('./api/mailRoutes');
const paymentRoutes = require('./api/paymentRoutes');
const seedDB = require('./seed');
const cron = require('./controllers/cron');
require('dotenv').config()
require('./mail');


mongoose.connect(process.env.mongoURI)
  .then(() => console.log('DB Connected!'));

// mongoose.connect('mongodb+srv://vaibhavshrotriyas:Vaibhav2876@cluster0.mkuk0qb.mongodb.net/TodoDB?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('DB Connected!'));

// seedDB();

var whitelist = ['http://localhost:5173', 'https://vocalise.netlify.app','http://localhost:5174']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(
  cors(corsOptions)
);

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(todoRoutes);
app.use(userRoutes);
app.use(mailRoutes);
app.use(paymentRoutes)
app.use('/cron', cron);

app.get('/' , (req , res)=>{
    res.status(200).json({msg: "Welcome to Vocalize Backend"})
 })

const PORT=8089
app.listen(PORT, ()=>{
    console.log("Server Connected at " + PORT);
})