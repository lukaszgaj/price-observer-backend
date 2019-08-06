import {plainToClass} from 'class-transformer';
import express from 'express';
import {controller, httpPost, principal, request, response} from 'inversify-express-utils';
import rp from 'request-promise';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';
import parse from 'url-parse';
import {Principal} from '../../Infrastructure/Auth/Principal';
import {MoreleParser} from '../../Infrastructure/Services/Parsers/MoreleParser';
import {Url} from '../APIModels/Url/Url';
import {checkAuthentication} from '../Utils/checkAuthentication';

const path = '/url';

@ApiPath({
    name: 'Url',
    path,
})
@controller(path)
export class UrlController {
    constructor(
        private moreleParser: MoreleParser,
    ) {
    }

    @ApiOperationPost({
        description: 'Return information about product',
        parameters: {
            body: {
                description: 'Url path',
                model: Url.TYPE,
                required: true,
            },
        },
        path: '/parse-product',
        responses: {
            200: {description: 'OK'},
        },
        security: {apiKeyHeader: []},
    })
    @httpPost('/parse-product')
    async parse(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        await checkAuthentication(authPrincipal);
        const normalizedBody = plainToClass(Url, req.body);
        if (!normalizedBody.path) {
            res.status(400).json({message: 'PLEASE_PROVIDE_VALID_DATA'});
            return;
        }
        const url = parse(normalizedBody.path);
        if (url.hostname !== 'www.morele.net') {
            res.status(400).json({message: 'THIS_DOMAIN_IS_NOT_SUPPORTED'});
            return;
        }
        const html = await rp(normalizedBody.path);
        const productData: any = this.moreleParser.getProductData(html);
        productData.URL = normalizedBody.path;
        res.status(200).json(productData);
    }
}
