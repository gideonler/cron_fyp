
const nodemailer = require('nodemailer');
// const cron = require('node-cron');
// const Incident = require('../model/incident');
// const Camera = require('../model/camera');
// const User = require('../model/user');
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
mongoose.connect(`insert mongoose connection string`).catch(() => {
    console.log("Could not connect to mongodb");
  });
function cronFunction() {

    //code for the automated task
    const mongoose = require('mongoose');
    const nodemailer = require('nodemailer');
    // const cron = require('node-cron');
    // const Incident = require('../model/incident');
    // const Camera = require('../model/camera');
    const User = require('./api/users');
    const Incident = require('./api/incident');
    //Email Configuration
    const transporter = nodemailer.createTransport({
      service: 'Outlook', 
      auth: {
        user: 'enter email username',
        pass: 'enter email password',
      },
    });
    
    //FOR NEW INCIDENTS EMAIL NOTIFICATION
    //Check for new incidents with email notification not sent yet
    async function checkForNewInserts() {
      try {
        // Find new documents that haven't been sent an email
        const newDocuments = await Incident.find({ sentEmail: false });
    
        if (newDocuments.length > 0) {
          for (const newDocument of newDocuments) {
            // Send email notification
            sendEmailNotification(newDocument);
            // Mark the document as "sent" to avoid resending
            newDocument.sentEmail = true;
            await newDocument.save();
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } 
    }
    
    //To send email notification for new incidents
    async function sendEmailNotification(newDocument) {
    
      //Get all subscribed users
      const toUsers = await User.find({subscribe:true});
      
      //Get all emails of subscribed users
      var toEmails = "";
    
      toUsers.forEach(user => {
        if (toEmails == "") {
          toEmails += user.email;
        } else {
          toEmails += ";" + user.email;
        }
        });
    
      console.log(toEmails);
    
      const mailOptions = {
        from: 'oopg2t4@outlook.com',
        //can support multiple emails like this: to: 'yeoshi.tan.2020@scis.smu.edu.sg;oopg2t4@outlook.com', + only for outlook email addresses
        to: toEmails,
        subject: 'New Fight Occurence!',
        text: `Hi RC Team,
        \nA fight incident has just broken out. These are the details:\n
        Unit: ${JSON.stringify(newDocument.unit).substring(1,7)} \n
        Date: ${JSON.stringify(newDocument.date).substring(1,11)}\n
        Time: ${JSON.stringify(newDocument.date).substring(12,17)}\n
        Day: ${JSON.stringify(newDocument.day).substring(1,4)}
        \nView the full details of the fight incident in the Silver Lining Dashboard. Do contact an emergency personnel if needed.
        \n[This is an automatically generated email – please do not reply to it. If you have any queries, please email rc@outlook.com for help.] `,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
    // Schedule the script to run periodically - every 15 minutes
    //ACTIVATE WHEN TESTING!!!
    //15 minutes - '*/15 * * * *'
    // export const cron = () => {
    //     checkForNewCameraInserts();
    //     checkForNewInserts();
    //   //code for the automated task
    
    // };
    
    // cron.schedule('* * * * *', () => {
    //   console.log('Checking for new incident inserts...');

    // });
    checkForNewInserts();
    // console.log('Checking for new incident inserts...');
    // checkForNewInserts();
    
    //FOR CAMERA NOT WORKING EMAIL NOTIFICATION
    //Check for new issues if camera not working with email notification not sent yet
    async function checkForNewCameraInserts() {
      try {
        // Find new documents that haven't been sent an email
        const newDocuments = await Camera.find({ sentCameraEmail: false });
    
        if (newDocuments.length > 0) {
          for (const newDocument of newDocuments) {
            // Send email notification
            sendEmailCameraNotification(newDocument);
            // Mark the document as "sent" to avoid resending
            newDocument.sentCameraEmail = true;
            await newDocument.save();
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } 
    }
    
    //To send email notification for new incidents
    function sendEmailCameraNotification(newDocument) {
      const unit = JSON.stringify(newDocument.unit).substring(1,6)
      const mailOptions = {
        from: 'oopg2t4@outlook.com',
        //can support multiple emails like this: to: 'yeoshi.tan.2020@scis.smu.edu.sg;oopg2t4@outlook.com', + only for outlook email addresses
        to: 'oopg2t4@outlook.com',
        subject: `[URGENT - ${unit}] CAMERA NOT WORKING`,
        text: `Hi RC Team,
        \nThe camera in unit ${unit} is currently not working. 
        \nDo fix it as soon as possible to continue detecting fighting incidents within the unit. If there are any other issues, contact an emergency personnel if needed.
        \n[This is an automatically generated email – please do not reply to it. If you have any queries, please email rc@outlook.com for help.] `,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
    // Schedule the script to run periodically - every 6 hours
    //ACTIVATE WHEN TESTING!!!
    
    // cron.schedule('* * * * *', () => {
    //   console.log('Checking for new camera issue inserts...');
    //   checkForNewCameraInserts();
    // });
    
};


cronFunction();
module.exports = cronFunction;
