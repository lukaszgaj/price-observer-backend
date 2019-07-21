import {injectable} from 'inversify';
import {ApiModel, ApiModelProperty} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';

@ApiModel({name: RegisteredUser.TYPE})
@injectable()
export class RegisteredUser extends Typegoose {
    static readonly TYPE = 'RegisteredUser';

    @ApiModelProperty({
        example: 'testUser@wp.pl' as any,
        required: true,
    })
    @prop()
    email: string;

    @ApiModelProperty({
        example: 'heheNiePowiem123' as any,
        required: true,
    })
    @prop()
    password: string;
}
