import {Product} from '../../App/APIModels/Product/Product';
import rp from 'request-promise';
import {MoreleParser} from './Parsers/MoreleParser';
import {UserDetails} from '../../App/APIModels/Product/UserDetails';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import * as nodemailer from 'nodemailer';

export const monitorProducts = async (productsList: Product[] | null, productsRepository: ProductsRepository) => {

    if (productsList)
        await productsList.forEach(async (productFromDB: Product) => {
            let html = await rp(productFromDB.URL.toString());
            if (productFromDB.shopName === 'morele') {
                const currentProductPrice: any = new MoreleParser().getProductData(html).currentPrice!;
                if (productFromDB.currentPrice.count != currentProductPrice.count) {
                    productFromDB.currentPrice = currentProductPrice;
                    await productsRepository.updateOne(productFromDB.productId, productFromDB.shopName, productFromDB);
                }
                productFromDB.usersDetails.forEach((user: UserDetails) => {
                    if (user.expectedPrice!.count >= currentProductPrice.count)
                        console.log(`the price is smaller! send email to user ${user.userId}`);
                    else {
                        0
                        console.log('price is not smaller :<');
                    }
                })
            }
        });
};

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

export const getResetPasswordEmailOptions = (senderName: string, senderEmailAddress: string, receiverUserName: string, receiverEmailAddress: string, newPassword: string): nodemailer.SendMailOptions => {

    const html = `<div>
                    <h2 style='padding-top: 20px; padding-bottom: 20px; color: #DA7144; font-size: 19px;'><strong>ALERT CENOWY</strong></h2>
                    <div style='color: #384049;'>
                      <h3 style='padding-bottom: 15px'>RESETOWANIE HASŁA</h3>
                      <div style='padding-bottom: 10px; text-transform: capitalize;'>
                        Witaj ${receiverUserName}
                      </div>
                      <div>
                        Twoje nowe hasło to: <strong>${newPassword}</strong>.<br/>
                        Po zalogowaniu do serwisu należy bezzwłocznie zmienić hasło.
                      </div>
                      <div style='padding-top: 30px; font-size: 11px'>
                        Wiadomość została wygenerowana automatyczne i nie należy na nią odpowiadać.
                      </div>
                    </div>
                  </div>`;

    return {
        from: `${senderName} <${senderEmailAddress}>`,
        to: receiverEmailAddress,
        subject: 'Resetowanie hasła',
        text: 'To jest text wiadom',
        html: html,
    }
};

