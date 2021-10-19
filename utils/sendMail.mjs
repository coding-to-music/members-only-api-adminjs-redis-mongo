import { config } from 'dotenv';
import sgMail from '@sendgrid/mail';

export const sendMail = async (email, code) => {

    config();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: process.env.SENDER_IDENTITY,
        subject: 'Email Verification code',
        text: `Your email verification code is ${code}`,
        html: `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`,
    };
    try {
        await sgMail.send(msg);
        console.log('Email sent successfully!!!')
    } catch (err) {
        console.log(err);
        if (err.response) {
            console.error(err.response.body)
        }
    }
}