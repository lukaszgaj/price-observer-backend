import {prop, Typegoose} from 'typegoose';

export class DiscussionPost extends Typegoose {
    static readonly TYPE = 'Price';

    @prop()
    userName: string;
    @prop()
    message: string;
    @prop()
    link: string;
    @prop()
    date: string;
}
