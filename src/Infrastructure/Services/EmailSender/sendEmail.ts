import * as nodemailer from 'nodemailer';

export const sendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
    const gmailAddress = process.env.GMAIL_ADDRESS;
    //encoded password??
    const password = process.env.GMAIL_PASSW;

    if (password && gmailAddress) {
        const transporter: nodemailer.Transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmailAddress,
                pass: password,
            }
        });


        await transporter.sendMail(mailOptions, function (error: any, response: any) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
            transporter.close();
        });
    } else {
        throw new Error('Cannot find email address and password');
    }
};