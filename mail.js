const nodemailer = require('nodemailer');
const nodeSchedule = require('node-schedule');
// let cron = require('node-cron');
const todo = require('./models/Todo');
require('dotenv').config()


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



async function checkTaskCompletionTime() {

    let tasks = await todo.find({});
    tasks.forEach( async task => {
        const currentTime = new Date().toLocaleString();
        const completionTime = new Date(task.dueDate).toLocaleString();

        if ((currentTime >= completionTime) && !task.isComp) {
            await sendEmail(task);
            let time= new Date();
            await todo.findByIdAndUpdate(task._id, {dueDate: new Date(time.getTime() + 30*60000)});
        }
    });
}


 async function sendEmail(task) {

    const mailOptions = {
        from: 'vaibhav.sharma2_cs21@gla.ac.in',
        to: task.owner,
        subject: `Vocalize: Gentle Reminder - You've Got Tasks Pending!`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vocalize: Gentle Reminder - You've Got Tasks Pending!</title>
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
              font-size: 20px;
              margin-bottom: 10px;
              color: #333;
            }
            p {
              line-height: 1.5;
              color: #666;
              margin-bottom: 15px;
            }
            .tasks {
              list-style: none;
              padding: 0;
              margin: 10px auto;
            }
            .tasks li {
              margin-bottom: 5px;
              display: flex;
              align-items: center;
            }
            .tasks li span.icon {
              display: inline-block;
              margin-right: 10px;
              font-size: 18px;
              color: #ff9900;
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
              color: #fff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hey There!, Looks like you have some pending tasks on Vocalize!</h1>
            <p>Just a friendly reminder that you have a few tasks waiting for your attention. Take a quick look and conquer them today!</p>
            <ul class="tasks">
              <li><span class="icon">&#9875;</span> <h3>Task : ${task.task}</h3></li>
              </ul>
            <p>Remember, you can always use your voice to manage your tasks with Vocalize. It's fast, convenient, and keeps you on top of your schedule.</p>
            <a href="https://vocalise.netlify.app" class="cta">Open Vocalize Now</a>
            <p>We hope this reminder helps! If you don't want to receive these notifications in every 30 Minutes, you can easily mark your task as compleated within the app.</p>
            <p>Happy vocalizing!</p>
            <p>The Vocalize Team</p>
          </div>
        </body>
        </html>`
    };

    // const mailOptions = {
    //     from: 'vaibhav.sharma2_cs21@gla.ac.in',
    //     to: "vaibhavshrotriyas@gmail.com",
    //     subject: 'Task Completion Reminder',
    //     text: `The task  is due for completion at jj.`
    // };
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

console.log("Mail Service Started");
nodeSchedule.scheduleJob('* * * * *', () => {
    checkTaskCompletionTime();
});

