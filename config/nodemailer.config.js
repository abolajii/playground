require("dotenv").config();
const nodemailer = require("nodemailer");

const user = process.env.user;
const host = process.env.host;
const pass = process.env.pass;

const transport = nodemailer.createTransport({
  host,
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

module.exports.sendConfirmationEmail = async (
  name,
  email,
  confirmationCode
) => {
  await new Promise((resolve, reject) => {
    console.log("sending mail...");
    // send mail
    transport.sendMail(
      {
        from: user,
        to: email,
        subject: "Please verify your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up! Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3002/verify-user/${confirmationCode}> Click here</a>
        </div>`,
      },
      (err, info) => {
        if (err) {
          console.log("error sending mail...");
          console.error(err);
          reject(err);
        } else {
          console.log("sent mail...");
          console.log(info);
          resolve(info);
        }
      }
    );
  });
};

module.exports.sendResetPasswordEmail = (name, email, otp) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Reset password link",
      html: `
      <html>
      <body style="margin: 0; padding: 0; box-sizing: border-box;">
      <p>Hello ${name},</p>
      <p>Here's the 6 digits OTP</p>
      <div style="display: flex;">
      <div style="margin-right: 10px; font-weight: 600; font-size: 18px">
      <p>${otp[0]}</p>
      </div>
      <div style="margin: 0 10px; font-weight: 600; font-size: 18px">
      <p>${otp[1]}</p>
      </div>
      <div style="margin: 0 10px; font-weight: 600; font-size: 18px">
      <p>${otp[2]}</p>
      </div>
      <div style="margin: 0 10px; font-weight: 600; font-size: 18px">
      <p>${otp[3]}</p>
      </div>
      <div style="margin: 0 10px; font-weight: 600; font-size: 18px">
      <p>${otp[4]}</p>
      </div>
      <div style="margin: 0 10px; font-weight: 600; font-size: 18px">
      <p>${otp[5]}</p>
      </div>
      </div>
      </body>
      </html>
          `,
    })
    .catch((err) => console.log(err));
};
