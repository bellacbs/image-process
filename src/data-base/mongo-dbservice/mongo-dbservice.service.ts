import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './image.schema';

@Injectable()
export class MongoDbService {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  async saveImage(url: string, timestamp: Date): Promise<Image> {
    const image = new this.imageModel({ url, timestamp });
    return image.save();
  }

  async getImagesData(): Promise<Image[]> {
    return this.imageModel.find().exec();
  }
}
