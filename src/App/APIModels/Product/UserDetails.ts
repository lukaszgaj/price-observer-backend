import {ApiModelProperty} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';
import {Price} from './Price';

export class UserDetails extends Typegoose {
    static readonly TYPE = 'UserDetails';

    @ApiModelProperty({
        example: '111111111' as any,
        required: false,
    })
    @prop()
    userId: string | undefined;

    @ApiModelProperty({
        example: '2019-07-22T18:39:23.139Z' as any,
        required: false,
    })
    @prop()
    addedAt: string | undefined;

    @ApiModelProperty({
        model: Price.TYPE,
        required: true,
    })
    @prop()
    expectedPrice: Price | undefined;
}
