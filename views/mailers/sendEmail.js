const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host:  'smpt.gmail.com',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user:process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        console.log("sending email to "+ email);

        await transporter.sendMail({
            from: process.env.USER,
            to:email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;