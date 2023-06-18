import nodemailer from 'nodemailer';

export default async function sendEmail(to_email, subject, message) {
    if(!to_email || !subject || !message) {
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "helpmymom@hmm.com",
        to: to_email,
        subject: subject,
        html: message
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}