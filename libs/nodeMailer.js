import nodemailer from "nodemailer"
import asyncHandler from "express-async-handler"

const sendEmail = asyncHandler(async(data, req, res)=>{

    let transporter = nodemailer.createTransport({
      host: "mail.smbdigitalzone.online",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "weeshare@smbdigitalzone.online",
        pass: "svMU*31kZSNd",
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "weeshare@smbdigitalzone.online", // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text,
      html: data.html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
})

export default sendEmail;