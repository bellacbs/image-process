import { IsNotEmpty, IsUrl } from 'class-validator';

export class ProcessImageDTO {
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
