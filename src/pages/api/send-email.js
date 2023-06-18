import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const {to_email, subject, message} = req.body;

    if(!to_email || !subject || !message) {
        return res.status(400).json({ message: 'Bad Request' })
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
        from: process.env.EMAIL_USERNAME,
        to: to_email,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

    res.status(200).json({ success: true, message: 'Email sent successfully' })
};