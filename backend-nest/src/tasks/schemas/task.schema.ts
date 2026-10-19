import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true, maxlength: 120 })
  title: string;

  @Prop({ default: '', trim: true, maxlength: 2000 })
  description: string;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string;

  @Prop({
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
