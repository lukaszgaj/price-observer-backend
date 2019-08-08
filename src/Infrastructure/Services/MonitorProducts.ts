import {Product} from '../../App/APIModels/Product/Product';
import rp from 'request-promise';
import {MoreleParser} from './Parsers/MoreleParser';
import {UserDetails} from '../../App/APIModels/Product/UserDetails';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import * as nodemailer from 'nodemailer';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {User} from '../../App/APIModels/User/User';

export const monitorProducts = async (productsList: Product[] | null, productsRepository: ProductsRepository, usersRepository: UsersRepository) => {
    if (productsList)
        await productsList.forEach(async (productFromDB: Product) => {
            let html = await rp(productFromDB.URL.toString());
            if (productFromDB.shopName === 'morele') {
                const currentProductPrice: any = new MoreleParser().getProductData(html).currentPrice!;
                if (productFromDB.currentPrice.count != currentProductPrice.count) {
                    productFromDB.currentPrice = currentProductPrice;
                    await productsRepository.updateOne(productFromDB.productId, productFromDB.shopName, productFromDB);
                }
                productFromDB.usersDetails.forEach(async (userInfo: UserDetails) => {
                    if (userInfo.expectedPrice!.count >= currentProductPrice.count) {
                        const user: User | null = await usersRepository.getUserById(userInfo.userId!);
                        if (user) {
                            const mailOptions: nodemailer.SendMailOptions = getPriceNotificationMailOptions('Alert cenowy', process.env.GMAIL_ADDRESS!, user, productFromDB);
                            await sendEmail(mailOptions);
                            await removeUserDetailsFromProduct(user._id, productFromDB, productsRepository);
                        } else {
                            throw Error('User not found');
                        }
                    }
                })
            }
        });
};

const removeUserDetailsFromProduct = async (userId: string, product: Product, productsRepository: ProductsRepository) => {

    if (product && product.usersDetails.length > 1) {
        product.usersDetails = product.usersDetails.filter((user: UserDetails) => user.userId !== userId);
        await productsRepository.updateOne(product.productId, product.shopName, product);
        return;
    }

    await productsRepository.remove(product);
    return;
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