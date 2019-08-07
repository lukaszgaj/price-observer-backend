import {Product} from '../../App/APIModels/Product/Product';
import rp from 'request-promise';
import {MoreleParser} from './Parsers/MoreleParser';
import {UserDetails} from '../../App/APIModels/Product/UserDetails';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import * as nodemailer from 'nodemailer';

export const monitorProducts = async (productsList: Product[] | null, productsRepository: ProductsRepository) => {

    if (productsList && productsList.length> 100)
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

                        console.log('price is not smaller :<');
                    }
                })
            }
        });
};

export const sendEmail = async (userEmail: string) => {
    const gmailAddress = process.env.GMAIL_ADDRESS;
    //encoded password??
    const password = process.env.GMAIL_PASSW;

    if (password && gmailAddress) {
         const transporter: nodemailer.Transporter = nodemailer.createTransport( {
            service: "Gmail",
            auth: {
                user: gmailAddress,
                pass: password,
            }
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: `Alert cenowy ✔ <${gmailAddress}>`, // sender address
            to: userEmail, // list of receivers
            subject: "Helloł !✔", // Subject line
            text: "Helloł world ✔", // plaintext body
            html: "<b>CZEŚĆ !!! ✔</b>" // html body
        };

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

