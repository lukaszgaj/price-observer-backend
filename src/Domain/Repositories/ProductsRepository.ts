import {Product} from '../../App/APIModels/Product/Product';

export abstract class ProductsRepository {
    abstract async getOne(productId: string, shopName: string): Promise<Product | null>;
    abstract async getAll(userId: string): Promise<Product[] | null>;
    abstract async store(product: Product): Promise<void>;
    abstract async updateOne(productId: string, shopName: string, product: Product): Promise<Product | null>;
}
