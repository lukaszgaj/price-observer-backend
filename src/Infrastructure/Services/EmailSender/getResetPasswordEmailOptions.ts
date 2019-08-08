import {User} from '../../../App/APIModels/User/User';
import * as nodemailer from 'nodemailer';

export const getResetPasswordEmailOptions =
    (senderName: string, senderEmailAddress: string, receiver: User, newPassword: string): nodemailer.SendMailOptions => {

        const html = `<div>
                    <h2 style='padding-top: 20px; padding-bottom: 10px; color: #DA7144; font-size: 23px;'><strong>ALERT CENOWY</strong></h2>
                    <div style='color: #384049;'>
                      <h3 style='padding-bottom: 15px'>RESETOWANIE HASŁA</h3>
                      <div style='padding-bottom: 10px; text-transform: capitalize;'>
                        Witaj ${receiver.name}
                      </div>
                      <div>
                        Twoje nowe hasło to: <strong>${newPassword}</strong>.<br/>
                        Po zalogowaniu do serwisu należy zmienić hasło.
                      </div>
                      <div style='padding-top: 30px; font-size: 11px'>
                        Wiadomość została wygenerowana automatyczne i nie należy na nią odpowiadać.
                      </div>
                    </div>
                  </div>`;

        return {
            from: `${senderName} <${senderEmailAddress}>`,
            to: receiver.email,
            subject: 'Resetowanie hasła',
            text: '',
            html: html,
        }
    };