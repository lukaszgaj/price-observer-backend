import {Product} from '../../App/APIModels/Product/Product';
import rp from 'request-promise';
import {MoreleParser} from './Parsers/MoreleParser';
import {Parser} from './Parsers/Parser';
import Price = Parser.Price;
import {UserDetails} from '../../App/APIModels/Product/UserDetails';

const monitorProducts = async (productsList: Product[]) => {
    await productsList.forEach( async (product: Product) => {
        console.log('product.URL', product.URL);
        let html = await rp(product.URL.toString());
        const currentProductPrice: Price = new MoreleParser().getProductData(html).currentPrice!;
        product.usersDetails.forEach((user: UserDetails) => {
            if (user.expectedPrice!.count >= currentProductPrice.count)
                console.log(`the price is smaller! send email to user ${user.userId}`);
            else
                console.log('price is not smaller :<');
        })
    })
};

export default monitorProducts;