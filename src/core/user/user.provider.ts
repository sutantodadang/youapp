
import { Connection } from 'mongoose';
import { InterestSchema, UserSchema } from './entities/user.entity';

export const userProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'INTEREST_MODEL',
        useFactory: (connection: Connection) => connection.model('Interest', InterestSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
