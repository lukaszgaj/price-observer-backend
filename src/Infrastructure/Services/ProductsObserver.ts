import Price = Parser.Price;
import {injectable} from 'inversify';
import rp from 'request-promise';
import {Product} from '../../App/APIModels/Product/Product';
import {UserDetails} from '../../App/APIModels/Product/UserDetails';
import {User} from '../../App/APIModels/User/User';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import {MoreleParser} from './Parsers/MoreleParser';
import {Parser} from './Parsers/Parser';
import {EmailSender} from './EmailSender';

@injectable()
export class ProductsObserver {
    constructor(
        private productsRepository: ProductsRepository,
        private usersRepository: UsersRepository,
        private emailSender: EmailSender,
    ) {}

    start = () => {
      setInterval(() => this.monitorProducts(), 600000);
    };

    private monitorProducts = async () => {
        const productsList = await this.productsRepository.getAll();

        if (productsList) {
            await productsList.forEach(async (productFromDB: Product) => {
                if (productFromDB.shopName === 'morele') {
                    const currentProductPrice: Price | undefined = await this.getCurrentProductPrice(productFromDB);

                    if (!currentProductPrice) {
                        throw Error('CANNOT_CHECK_CURRENT_PRODUCT_PRICE');
                        return;
                    }

                    if (productFromDB.currentPrice.count !== currentProductPrice.count) {
                        productFromDB.currentPrice.count = currentProductPrice.count;
                        productFromDB.currentPrice.currency = currentProductPrice.currency;
                        await this.productsRepository.updateOne(productFromDB.productId, productFromDB.shopName, productFromDB);
                    }

                    productFromDB.usersDetails.forEach(async (userInfo: UserDetails) => {
                        if (userInfo.expectedPrice!.count <= currentProductPrice.count) {
                            const user: User | null = await this.usersRepository.getUserById(userInfo.userId!);

                            if (!user) {
                                throw Error('USER_NOT_FOUND');
                                return;
                            }

                            if (!process.env.GMAIL_ADDRESS) {
                                throw Error('SENDER_EMAIL_ADDRESS_NOT_FOUND');
                                return;
                            }

                            await this.emailSender.sendProductPriceNotificationEmail(user, productFromDB);
                            await this.removeProduct(user._id, productFromDB);
                        }
                    });

                }
            });
        }
    };

    private getCurrentProductPrice = async (product: Product): Promise<Price | undefined> => {
        const html = await rp(product.URL.toString());
        return new MoreleParser().getProductData(html).currentPrice;
    };

    private removeProduct = async (userId: string, product: Product) => {
        if (product && product.usersDetails.length > 1) {
            product.usersDetails = product.usersDetails.filter((user: UserDetails) => user.userId !== userId);
            await this.productsRepository.updateOne(product.productId, product.shopName, product);
            return;
        }

        await this.productsRepository.remove(product);
        return;
    }
}
