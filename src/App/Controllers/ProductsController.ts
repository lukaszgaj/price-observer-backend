import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpGet, httpPost, principal, request, response} from 'inversify-express-utils';
import {ApiOperationGet, ApiOperationPost, ApiPath} from 'swagger-express-ts';
import {ProductsRepository} from '../../Domain/Repositories/ProductsRepository';
import {Principal} from '../../Infrastructure/Auth/Principal';
import {Product} from '../APIModels/Product/Product';
import {checkAuthentication} from '../Utils/checkAuthentication';

const path = '/products';

@ApiPath({
    name: 'Product',
    path,
})
@controller(path)
export class ProductsController {
    constructor(
        private productsRepository: ProductsRepository,
    ) {
    }

    @ApiOperationPost({
        description: 'Add new product',
        parameters: {
            body: {
                description: 'New product data',
                model: Product.TYPE,
                required: true,
            },
        },
        path: '/add',
        responses: {
            200: {description: 'OK'},
        },
        security: {apiKeyHeader: []},
    })
    @httpPost('/add')
    async add(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const normalizedBody = plainToClass(Product, req.body);
        if (!normalizedBody.name ||
            !normalizedBody.currentPrice ||
            !normalizedBody.productId ||
            !normalizedBody.shopName) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }
        const productFromDatabase =
            await this.productsRepository.getOne(normalizedBody.productId, normalizedBody.shopName);
        const userId = authPrincipal.getDetails().userId.toString();

        if (!productFromDatabase) {
            normalizedBody.assignedTo = [];
            normalizedBody.assignedTo.push(userId);
            await this.productsRepository.store(normalizedBody);
            res.status(200).json({message: 'STORED_SUCCESSFULLY'});
            return;
        }

        if (productFromDatabase && productFromDatabase.assignedTo.includes(userId)) {
            res.status(409).json({message: 'USER_ALREADY_ASSIGNED_TO_PRODUCT'});
            return;
        }
        productFromDatabase.assignedTo.push(userId);
        await this.productsRepository.updateOne(normalizedBody.productId, normalizedBody.shopName, productFromDatabase);
        res.status(200).json({message: 'PRODUCT_UPDATED_SUCCESSFULLY'});
    }

    @ApiOperationGet({
        description: 'Get all products assigned to authorized user',
        path: '/all',
        responses: {
            200: {description: 'OK'},
        },
        security: {apiKeyHeader: []},
    })
    @httpGet('/all')
    async authenticate(
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const userId = authPrincipal.getDetails().userId;
        const products = await this.productsRepository.getAll(userId.toString());
        res.status(200).json({products});
    }
}
