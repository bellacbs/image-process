import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import packages from '../package.json';
import { MongoDbService } from './data-base/mongo-dbservice/mongo-dbservice.service';
import axios from 'axios';
import sharp from 'sharp';

@Injectable()
export class AppService {
  constructor(private readonly mongoDBService: MongoDbService) {}
  getStatus() {
    const serverPackages = packages.dependencies;
    return { serverPackages };
  }

  async processImage(imageURL: string): Promise<Buffer> {
    try {
      const imageBuffer = await this.getImageBuffer(imageURL);

      const processedImageBuffer = await sharp(imageBuffer)
        .grayscale()
        .resize(200, 200)
        .toBuffer();

      const timestamp = new Date();
      await this.mongoDBService.saveImage(imageURL, timestamp);

      return processedImageBuffer;
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImagesData(): Promise<any> {
    return this.mongoDBService.getImagesData();
  }

  private async getImageBuffer(imageURL: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageURL, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);
      return imageBuffer;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Verify whether you are sending an image URL.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
