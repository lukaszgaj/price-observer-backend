import {hashSync} from 'bcrypt';
import {injectable} from 'inversify';
import {ApiModel, ApiModelProperty} from 'swagger-express-ts';
import {pre, prop, Typegoose} from 'typegoose';

@ApiModel({name: User.TYPE})
@pre<User>('save', function() {
    if (this.isModified('password')) {
        this.password = hashSync(this.password, 10);
    }
})

@injectable()
export class User extends Typegoose {
    static readonly TYPE = 'User';

    _id: string;

    @ApiModelProperty({
        example: 'testUser@wp.pl' as any,
        required: true,
    })
    @prop()
    email: string;

    @ApiModelProperty({
        example: 'testUser' as any,
        required: true,
    })
    @prop()
    name: string;

    @ApiModelProperty({
        example: 'heheNiePowiem123' as any,
        required: true,
    })
    @prop()
    password: string;
}
