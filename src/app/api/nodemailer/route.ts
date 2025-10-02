import { auth } from "@clerk/nextjs/server"

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port: 465,
        auth:{
            user:'thridhath@wigoh.ai',
            pass:'rvnt wgqp aoyh zioa'
        }

    }
);

function sendMail(sub: string, msg: string) {
  transporter.sendMail({
    from: "thridhath@wigoh.ai", // sender email
    to:"thridhath@gmail.com",
    subject: sub,
    html: msg,
  });
}

sendMail(
    "project update",
    "<p>Hi thridhath, what's the update on the project?</p>"

);




