import $ from 'cheerio';
import {injectable} from 'inversify';
import {Parser} from './Parser';

@injectable()
export class MoreleParser implements Parser {
    private html: string;

    getProductId() {
        const text = $('.prod-id-contact > div', this.html).text();
        const withoutBreaks =  text.replace(/\n+/g, '');
        return withoutBreaks.replace(/.*:(\d+)/, '$1');
    }
    getShopName() {
        return 'morele';
    }
    getName() {
        return $('.prod-info-inside > div > .prod-name', this.html).text();
    }
    getImgSrc() {
        return $('.gallery-holder > div > img', this.html).attr('src');
    }
    getCurrentPrice() {
        // TODO DO IT BETTER
        const price = $('#product_price_brutto', this.html).text();
        const countOnly = price.replace(/^((\d|\s)+,\d+)\s(zł)$/, '$1');
        const countWithoutComa = countOnly.replace(',', '.');
        return {
            count: parseFloat(countWithoutComa.replace(/\s/, '')),
            currency: 'zł',
        };
    }
    getCategory() {
        const text = $('#breadcrumbs li:nth-last-child(2) span', this.html).text();
        return text.replace(/\n+/g, '');
    }

    getProductData(html: string): Parser.ProductData {
        this.html = html;
        return {
            category: this.getCategory(),
            currentPrice: this.getCurrentPrice(),
            imgSrc: this.getImgSrc(),
            name: this.getName(),
            productId: this.getProductId(),
            shopName: this.getShopName(),
        };
    }
}
