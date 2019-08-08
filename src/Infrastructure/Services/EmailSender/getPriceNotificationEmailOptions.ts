import {User} from '../../../App/APIModels/User/User';
import {Product} from '../../../App/APIModels/Product/Product';
import * as nodemailer from 'nodemailer';

export const getPriceNotificationMailOptions =
    (senderName: string, senderEmailAddress: string, receiver: User, product: Product): nodemailer.SendMailOptions => {

        const html = `<div>
                    <h2 style='padding-top: 20px; padding-bottom: 10px; color: #DA7144; font-size: 23px;'><strong>ALERT CENOWY</strong></h2>
                    <div style='color: #384049;'>
                      <h3 style='padding-bottom: 15px'>TWÓJ PRODUKT OSIĄGNĄŁ OCZEKIWANĄ CENĘ</h3>
                      <div style='padding-bottom: 10px; text-transform: capitalize;'>
                        Witaj ${receiver.name}
                      </div>
                      <div>
                        <strong>${product.name}</strong>.<br/>
                        Kosztuje teraz ${product.currentPrice.count} ${product.currentPrice.currency}.
                      </div>
                      <div>
                        Aby zobaczyć ten produkt w sklepie, kliknij 
                      <a 
                      href=${product.URL}
                      >tutaj</a>
                      </div>
                      <div style='padding-top: 30px; font-size: 11px'>
                        Wiadomość została wygenerowana automatyczne i nie należy na nią odpowiadać.
                      </div>
                    </div>
                  </div>`;
        return {
            from: `${senderName} <${senderEmailAddress}>`,
            to: receiver.email,
            subject: 'Twój produkt osiągnął oczekiwaną cenę',
            text: '',
            html: html,
        }
    };