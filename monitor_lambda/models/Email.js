require('dotenv').config()
const mailgun = require("mailgun-js");

class Email {
  static async send(sender, senderName, recipient, subject, message) {
    const API_KEY = process.env.MAIL_KEY
    const DOMAIN = process.env.MAIL_URL
    const mg = mailgun({apiKey: API_KEY, domain: DOMAIN, timeout:3000});
    console.log(API_KEY, DOMAIN)
    const data = {
      from: `${senderName} <${sender}>`,
      to: recipient,
      subject: subject,
      text: message
    };


    await mg.messages().send(data)
      .then(data => {
        console.log('sending')
        console.log(data);
      }, err => {
        console.log('error')
        console.log(err);
        return err; 
      });
  }
}

module.exports = Email

