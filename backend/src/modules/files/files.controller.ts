import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
  Query,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('files')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private files: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузить файл в MinIO (max 8 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        bucket: { type: 'string', enum: ['products', 'avatars'], default: 'products' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 8 * 1024 * 1024 } }))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 8 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('bucket') bucket: 'products' | 'avatars' = 'products',
  ) {
    return this.files.upload(bucket, file).then((url) => ({ url }));
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить файл по URL' })
  deleteByUrl(@Query('url') url: string) {
    return this.files.deleteByUrl(url).then(() => ({ deleted: true }));
  }
}
