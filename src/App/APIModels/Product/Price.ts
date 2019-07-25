import {ApiModelProperty} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';

export class Price extends Typegoose {
    static readonly TYPE = 'Price';

    @ApiModelProperty({
        example: '999.54' as any,
        required: true,
    })
    @prop()
    count: number;

    @ApiModelProperty({
        example: 'zł' as any,
        required: true,
    })
    @prop()
    currency: string;
}
