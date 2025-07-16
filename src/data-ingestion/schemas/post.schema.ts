import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, unique: true })
  externalId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: Date.now })
  ingestedAt: Date;

  @Prop({ default: false })
  migrated: boolean;

  @Prop()
  migratedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Create indexes for better performance
PostSchema.index({ externalId: 1 });
PostSchema.index({ migrated: 1 });
PostSchema.index({ ingestedAt: -1 });