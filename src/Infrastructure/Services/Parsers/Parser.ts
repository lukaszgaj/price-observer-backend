export interface Parser {
    getProductId: () => string | undefined;
    getShopName: () => string | undefined;
    getName: () => string | undefined;
    getImgSrc: () => string | undefined;
    getCurrentPrice: () => Parser.Price | undefined;
    getCategory: () => string | undefined;
    getProductData: (html: string) => Parser.ProductData;
}

export namespace Parser {
    export interface ProductData {
        productId: string | undefined;
        shopName: string | undefined;
        name: string | undefined;
        imgSrc: string | undefined;
        currentPrice: Price | undefined;
        category: string | undefined;
    }

    export interface Price {
        count: number;
        currency: string;
    }
}
