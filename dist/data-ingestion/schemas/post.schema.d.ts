import { Document } from 'mongoose';
export type PostDocument = Post & Document;
export declare class Post {
    externalId: number;
    userId: number;
    title: string;
    body: string;
    ingestedAt: Date;
    migrated: boolean;
    migratedAt?: Date;
}
export declare const PostSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, Document<unknown, any, Post> & Post & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, Document<unknown, {}, import("mongoose").FlatRecord<Post>> & import("mongoose").FlatRecord<Post> & {
    _id: import("mongoose").Types.ObjectId;
}>;
