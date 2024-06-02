import {
  Controller,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
  Res,
  HttpException,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FileUploadService } from './file-uploads.service';
import { RequestWithUser } from 'request';
import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileService: FileUploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  async uploadFile(@Req() request:  RequestWithUser, @Res() reply: FastifyReply) {

    if (!request.isMultipart()) {
      throw new HttpException('Unsupported Media Type', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    const file = await request.file()
    const userId = request.user.id
        const filePath = await this.fileService.saveFile(userId, file)
        reply.send({
          url : filePath
        })
  }
  

  // @UseGuards(JwtAuthGuard)
  // @Get(':userId/:filename')
  // async getFile(
  //   @Param('userId') userId: string,
  //   @Param('filename') filename: string,
  //   @Req() request: RequestWithUser,
  //   @Res() response: FastifyReply,
  // ) {
  //   if (request.user._id !== userId) {
  //     throw new UnauthorizedException();
  //   }

  //   if (!this.fileService.userCanAccessFile(userId, filename)) {
  //     throw new UnauthorizedException();
  //   }

  //   const filePath = this.fileService.getFilePath(userId, filename);
  //   response.send(filePath);
  // }
}
