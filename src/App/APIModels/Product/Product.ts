import {injectable} from 'inversify';
import {ApiModel, ApiModelProperty} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';
import {Price} from './Price';

@ApiModel({name: Product.TYPE})
@injectable()
export class Product extends Typegoose {
    static readonly TYPE = 'Product';

    _id: string;

    @ApiModelProperty({
        example: '123123232141234' as any,
        required: true,
    })
    @prop()
    productId: string;

    @ApiModelProperty({
        example: 'x-kom' as any,
        required: true,
    })
    @prop()
    shopName: string;

    @ApiModelProperty({
        example: 'KOMPUTER DYSK 1000 MATRYCA ULTRA HD' as any,
        required: true,
    })
    @prop()
    name: string;

    @ApiModelProperty({
        example: 'https://zbygniew.pl/wp-content/uploads/2015/10/serduszko-1.jpg' as any,
        required: false,
    })
    @prop()
    imgSrc?: string;

    @ApiModelProperty({
        model: Price.TYPE,
        required: true,
    })
    @prop()
    currentPrice: Price;

    @ApiModelProperty({
        example: '2019-07-22T18:39:23.139Z' as any,
        required: false,
    })
    @prop()
    addedAt?: string;

    @prop()
    assignedTo: string[];

    @ApiModelProperty({
        model: Price.TYPE,
        required: false,
    })
    @prop()
    expectedPrice?: Price;

    @ApiModelProperty({
        example: 'Komputery' as any,
        required: false,
    })
    @prop()
    category?: string;
}