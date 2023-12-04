import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { MongoDbService } from './data-base/mongo-dbservice/mongo-dbservice.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { Image, ImageSchema } from './data-base/mongo-dbservice/image.schema';
import { RateLimitGuard } from './Guards/RateLimitGuard.guard';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongoDbService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
