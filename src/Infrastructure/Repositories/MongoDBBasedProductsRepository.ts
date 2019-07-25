import {injectable} from 'inversify';
import {Product} from '../../App/APIModels/Product/Product';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';

@injectable()
export class MongoDBBasedProductsRepository implements ProductsRepository {
    private productModel = this.product.getModelForClass(Product);

    constructor(
        private product: Product,
    ) {
    }

    async getOne(productId: string, shopName: string): Promise<Product | null> {
        return await this.productModel.findOne({
            productId,
            shopName,
        })
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async getAll(userId: string): Promise<Product[] | null> {
        return await this.productModel.find({
            assignedTo: userId,
        })
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async store(product: Product): Promise<void> {
        const {productId, category, currentPrice, expectedPrice, imgSrc, name, shopName, addedAt, assignedTo} = product;
        await this.productModel.create({
            addedAt: addedAt ? addedAt : new Date().toISOString(),
            assignedTo,
            category: category ? category : undefined,
            currentPrice,
            expectedPrice: expectedPrice ? expectedPrice : undefined,
            imgSrc: imgSrc ? imgSrc : undefined,
            name,
            productId,
            shopName,
        }).then(res => {
            return res;
        }).catch(e => {
            console.log('Could not store user because of: ', e);
        });
    }

    async updateOne(productId: string, shopName: string, product: Product): Promise<Product | null> {
        return await this.productModel.findOneAndUpdate(
        {
            productId,
            shopName,
        },
        product,
            {upsert: false},
        )
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
            });
    }
}
