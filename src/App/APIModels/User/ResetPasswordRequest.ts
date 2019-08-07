import {injectable} from 'inversify';
import {ApiModel} from 'swagger-express-ts';
import {prop, Typegoose} from 'typegoose';

@ApiModel({name: ResetPasswordRequest.TYPE})
@injectable()
export class ResetPasswordRequest extends Typegoose {
    static readonly TYPE = 'Url';

    @prop()
    currentPassword: string;

    @prop()
    newPassword: string;
}
