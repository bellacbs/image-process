import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ProcessImageDTO } from './Model/ProcessImageDTO.mmodel';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getStatus() {
    return this.appService.getStatus();
  }

  @Post('process-image')
  async processImage(@Body() body: ProcessImageDTO, @Res() res: Response) {
    const imageBuffer = await this.appService.processImage(body.imageUrl);
    (res as any).contentType('image/png');
    (res as any).send(imageBuffer);
  }

  @Get('images')
  getImages(): Promise<any> {
    return this.appService.getImagesData();
  }
}
