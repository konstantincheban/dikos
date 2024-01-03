import { MetroService } from './metro.service';
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
import { MetroTransactionsFileDTO } from './dto/metro-import-transactions.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('metro')
export class MetroController {
  constructor(private readonly metroService: MetroService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async uploadFile(
    @Body() body: MetroTransactionsFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return await this.metroService.importTransactions({
      userID: req.user.id,
      accountId: body.accountID,
      aggregationType: body.aggregationType,
      date: body.date,
      file: file,
    });
  }
}
