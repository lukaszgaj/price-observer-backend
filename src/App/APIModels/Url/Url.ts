import {injectable} from 'inversify';
import {ApiModel, ApiModelProperty} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';

@ApiModel({name: Url.TYPE})
@injectable()
export class Url extends Typegoose {
    static readonly TYPE = 'Url';

    @ApiModelProperty({
        example: 'https://www.morele.net/karta-graficzna-gigabyte-geforce-rtx-2060-wf-oc-6gb-gddr6-gv-n2060wf2oc-6gd-2-0-5801847/' as any,
        required: true,
    })
    @prop()
    path: string;
}
