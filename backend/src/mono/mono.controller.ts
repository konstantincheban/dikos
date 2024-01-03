import { MonoService } from './mono.service';
import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MonoTransactionsFileDTO } from './dto/mono-import-transactions.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('mono')
export class MonoController {
  constructor(private readonly monoService: MonoService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async uploadFile(
    @Body() body: MonoTransactionsFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return await this.monoService.importTransactions({
      userID: req.user.id,
      accountId: body.accountID,
      date: body.date,
      file: file,
    });
  }
}
