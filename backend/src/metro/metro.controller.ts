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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('metro')
export class MetroController {
  constructor(private readonly metroService: MetroService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  uploadFile(
    @Body() body: MetroTransactionsFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.metroService.importTransactions(
      req.user.id,
      body.accountID,
      body.aggregationType,
      file,
    );
  }
}
