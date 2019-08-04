import {injectable} from 'inversify';
import {Product} from '../../App/APIModels/Product/Product';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import {UserDetails} from '../../App/APIModels/Product/UserDetails';

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
            .then(res => res)
            .catch(err => {
                throw new Error(err);
            });
    }

    async getAll(userId: string): Promise<Product[] | null> {
        return await this.productModel.find({
            'usersDetails.userId': userId,
        })
            .then(res => {
                const productsWithoutOtherUsersInfo: Product[] = res.map((product: Product) => {
                    const currentUserDetails = product.usersDetails.find((user: UserDetails) => user.userId === userId);
                    product.usersDetails = [currentUserDetails!];
                    return product;
                });
                return productsWithoutOtherUsersInfo;
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    async store(product: Product): Promise<void> {
        const {productId, category, currentPrice, imgSrc, name, shopName, usersDetails} = product;
        await this.productModel.create({
            usersDetails: usersDetails,
            category: category ? category : undefined,
            currentPrice,
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

    async remove(product: Product): Promise<void> {
        await this.productModel.remove({productId: product.productId})
            .then(res => {
                return res;
            })
            .catch(err => {
                throw new Error(err);
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
