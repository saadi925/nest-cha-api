import { Module } from '@nestjs/common';
import { FileUploadService } from './file-uploads.service';
import { FileUploadController } from './file-uploads.controller';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadsModule {}
