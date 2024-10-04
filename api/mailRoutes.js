const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const todo = require('../models/Todo');
require('dotenv').config()

router.post('/mail/welcome',async (req, res)=>{
    let {email, name} = req.body;
    // let email = 'vaibhavshrotriyas@gmail.com';
    // let name = 'Vaibhav';
    let transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
  });

  const mailOptions = {
    from: 'vaibhav.sharma2_cs21@gla.ac.in',
    to: email,
    subject: 'Welcome to Vocalize!',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Vocalize!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #333;
          text-align: center;
        }
        p {
          line-height: 1.5;
          color: #666;
          margin-bottom: 15px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 10px auto;
        }
        ul li {
          margin-bottom: 5px;
          display: flex;
          align-items: center;
        }
        ul li span.icon {
          display: inline-block;
          margin-right: 10px;
          font-size: 18px;
          color: #007bff;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .cta {
          background-color: #007bff;
          color: #fff;
          text-align: center;
          padding: 10px 20px;
          border-radius: 5px;
          display: block;
          margin-top: 20px;
        }
        .cta a {
          cursor:pointer;
          color: #fff !important;
          text-decoration: none;
          
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Vocalize, ${name}!</h1>
        <p>We're thrilled to have you join our growing community and experience the power of voice-controlled to-do lists!</p>
        <ul>
          <li><span class="icon">&#10004;</span> Add tasks with your voice: Simply say "Add task" followed by the details, and Vocalize will handle it!</li>
          <li><span class="icon">&#9998;</span> Edit tasks on the fly: Need to change a deadline or adjust the description? Use your voice to modify them effortlessly!</li>
          <li><span class="icon">&#10003;</span> Mark tasks complete with a voice command: Finished a task? Say "Mark complete" and Vocalize will update its status.</li>
          <li><span class="icon">&#128101;</span> User Authentication: Create a user account for a personalized experience and access your tasks across devices.</li>
        </ul>
        <p>Get ready to transform your to-do list management! Open the app and speak your first command to get started.</p>
        <a href="https://vocalise.netlify.app" class="cta">Get Started with Vocalize</a>

        <p>If you have any questions, feel free to reach out to our friendly support team at <a href="mailto:vaibhav.sharma2_cs21@gla.ac.in">vaibhav.sharma2_cs21@gla.ac.in</a>.</p>
        <p>Happy vocalizing!</p>
        <p>The Vocalize Team</p>
      </div>
    </body>
    </html>`
};
await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({err: error})
            reject(error);
        } else {
            console.log('Email sent:', info.response);
            res.status(201).json({msg:info})
            resolve(info);
        }
    });
})
})

module.exports=router;