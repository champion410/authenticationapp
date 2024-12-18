import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({email, emailType, userId}: any) => {
  try{
    // Create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Here we want to update ; to find the user
    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000})
    }else if(emailType === "RESET"){
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000})
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "07688967eef99e",
        pass: "35947c3e06c500"
      }
    });

    const mailOptions = {
      from: 'hitsh@hitesh.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>
                Click
                <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a>
                to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} or copy paste the link below in your browser.
                <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
              </p>`
    }

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;

  }catch(error: any){
    throw new Error(error.message);
  }
} 