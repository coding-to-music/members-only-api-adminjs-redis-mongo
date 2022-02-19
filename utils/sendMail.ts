import { ENV } from '@utils/validateEnv';
import sgMail, { ResponseError } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

export const sendMail = async (email: string, code: string): Promise<void> => {

    sgMail.setApiKey(ENV.SENDGRID_API_KEY);
    const msg: MailDataRequired = {
        to: email,
        from: ENV.SENDER_IDENTITY,
        subject: 'Email Verification code',
        text: `Your email verification code is ${code}`,
        html: `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`,
    };
    try {
        await sgMail.send(msg);
        console.log('Email sent successfully!!!')
    } catch (err: any) {
        console.error(err);
        if (err instanceof ResponseError) {
            console.error(err.response.body)
        }
        if (err.response) {
            console.error(err.response.body)
        }
    }
}