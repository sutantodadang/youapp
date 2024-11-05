import * as mongoose from 'mongoose';



// export class Message { }

export const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
})

export interface Message extends mongoose.Document {
    readonly _id: mongoose.Types.ObjectId,
    readonly sender: mongoose.Types.ObjectId,
    readonly receiver: mongoose.Types.ObjectId,
    readonly content: string,
    readonly timestamp: Date,
    readonly read: boolean,

}

export interface IMessage {
    readonly _id: mongoose.Types.ObjectId,
    readonly sender: mongoose.Types.ObjectId,
    readonly receiver: mongoose.Types.ObjectId,
    readonly content: string,
    readonly timestamp: Date,
    readonly read: boolean,
}


// export const MessageSchema = new mongoose.Schema({
//     _id: mongoose.Types.ObjectId,
//     sendId: mongoose.Types.ObjectId,

//     password: String,
//     username: String,
//     name: String,
//     age: Number,
//     gender: String,
//     birthday: Date,
//     horoscope: String,
//     zodiac: String,
//     height: Number,
//     weight: Number
// });

