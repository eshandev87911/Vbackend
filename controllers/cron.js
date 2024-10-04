const nodemailer = require('nodemailer');
const todo = require('../models/Todo');
require('dotenv').config()

async function cron() {

    let tasks = await todo.find({});
    tasks.forEach( async task => {
        const currentTime = new Date().toLocaleString();
        const completionTime = new Date(task.dueDate).toLocaleString();

        if ((currentTime >= completionTime) && !task.isComp) {
            await sendmail(task);
            let time= new Date();
            await todo.findByIdAndUpdate(task._id, {dueDate: new Date(time.getTime() + 30*60000)});
        }
    });
}

async function sendmail(task) {
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
    to: task.owner,
    subject: 'Task Completion Reminder',
    html: `<h1>The task "${task.task}" is due for completion.</h1> <h2> Please mark the task as Completed or else you will get this reminder in every 30 minutes.</h2>
            <h3>- Team Voclise.</h3>`
};

await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
           
            reject(error);
        } else {
            console.log('Email sent:', info.response);
            
            resolve(info);
        }
    });
})
}

module.exports=cron;