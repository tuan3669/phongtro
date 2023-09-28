const nodemailer = require('nodemailer');
const sendMail = async (data) => {
  try {
    let transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.email',
      service: 'gmail',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_NAME, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail(data);

    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
