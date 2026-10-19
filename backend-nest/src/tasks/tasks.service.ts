import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task } from './schemas/task.schema.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedException('Invalid authenticated user');
    }

    const title = dto.title.trim();

    const existingTask = await this.taskModel.findOne({
      userId: new Types.ObjectId(userId),
      title: {
        $regex: `^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i',
      },
    });

    if (existingTask) {
      throw new ConflictException('A task with this title already exists');
    }

    return this.taskModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  async findAll(userId: string) {
    return this.taskModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(userId: string, id: string) {
    this.validateId(id);

    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    this.validateId(id);

    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(userId: string, id: string) {
    this.validateId(id);

    const task = await this.taskModel
      .findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }

  private validateId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Task not found');
    }
  }
}
