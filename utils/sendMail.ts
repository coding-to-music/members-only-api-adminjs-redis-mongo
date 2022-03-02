import { ENV } from '@utils/validateEnv';
import sgMail, { ResponseError } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

export const sendMail = async (email: string, subject: string, title: string, content: string) => {

    sgMail.setApiKey(ENV.SENDGRID_API_KEY);
    const msg: MailDataRequired = {
        to: email,
        from: ENV.SENDER_IDENTITY,
        subject: subject,
        text: title,
        html: content,
    };
    try {
        await sgMail.send(msg);
        console.log('Email sent successfully!!!')
    } catch (err: any) {
        if (err instanceof ResponseError && err.response) {
            console.error(err.response.body)
        }
    }
}