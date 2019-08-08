import {injectable} from 'inversify';
import {User} from '../../App/APIModels/User/User';
import {Product} from '../../App/APIModels/Product/Product';
import * as nodemailer from 'nodemailer';

@injectable()
export class EmailSender {

    constructor(
        private senderName: string,
        private senderEmailAddress: string,
        private senderEmailPassword: string,
    ) {
    }

    sendProductPriceNotificationEmail = (receiver: User, product: Product) => {
        this.sendEmail(this.getPriceNotificationMailOptions(receiver, product));
    };

    sendResetPasswordEmail = (receiver: User, newPassword: string) => {
        this.sendEmail(this.getResetPasswordEmailOptions(receiver, newPassword))
    };

    private sendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
        const transporter: nodemailer.Transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: this.senderEmailAddress,
                pass: this.senderEmailPassword,
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
    };

    private getResetPasswordEmailOptions =
        (receiver: User, newPassword: string): nodemailer.SendMailOptions => {

            const html = `<div>
                    <h2 style='padding-top: 20px; padding-bottom: 10px; color: #DA7144; font-size: 23px;'><strong>ALERT CENOWY</strong></h2>
                    <div style='color: #384049;'>
                      <h3 style='padding-bottom: 15px'>RESETOWANIE HASŁA</h3>
                      <div style='padding-bottom: 10px; text-transform: capitalize;'>
                        Witaj ${receiver.name},
                      </div>
                      <div>
                        twoje nowe hasło to: <strong>${newPassword}</strong>.<br/>
                        Po zalogowaniu do serwisu należy zmienić hasło.
                      </div>
                      <div style='padding-top: 30px; font-size: 11px'>
                        Wiadomość została wygenerowana automatyczne i nie należy na nią odpowiadać.
                      </div>
                    </div>
                  </div>`;

            return {
                from: `${this.senderName} <${this.senderEmailAddress}>`,
                to: receiver.email,
                subject: 'Resetowanie hasła',
                text: '',
                html: html,
            }
        };

    private getPriceNotificationMailOptions = (receiver: User, product: Product): nodemailer.SendMailOptions => {
        const html = `<div>
                    <h2 style='padding-top: 20px; padding-bottom: 10px; color: #DA7144; font-size: 23px;'><strong>ALERT CENOWY</strong></h2>
                    <div style='color: #384049;'>
                      <h3 style='padding-bottom: 15px'>TWÓJ PRODUKT OSIĄGNĄŁ OCZEKIWANĄ CENĘ</h3>
                      <div style='padding-bottom: 10px; text-transform: capitalize;'>
                        Witaj ${receiver.name},
                      </div>
                      <div>
                        <strong>${product.name}</strong><br/>
                        kosztuje teraz ${product.currentPrice.count} ${product.currentPrice.currency}.
                      </div>
                      <div>
                        Aby zobaczyć ten produkt w sklepie, kliknij 
                      <a 
                      href=${product.URL}
                      >tutaj</a>.
                      </div>
                      <div style='padding-top: 30px; font-size: 11px'>
                        Wiadomość została wygenerowana automatyczne i nie należy na nią odpowiadać.
                      </div>
                    </div>
                  </div>`;

        return {
            from: `${this.senderName} <${this.senderEmailAddress}>`,
            to: receiver.email,
            subject: 'Twój produkt osiągnął oczekiwaną cenę',
            text: '',
            html: html,
        }
    };

}