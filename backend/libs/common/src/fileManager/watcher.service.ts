import * as chokidar from 'chokidar';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FileManagerService } from './fileManager.service';

@Injectable()
export class WatcherService {
  constructor(private readonly fileService: FileManagerService) {}

  private readonly logger = new Logger('WatchService');

  watch(path: string, onChange: (content: string) => void) {
    this.logger.log(`Start watching file by path: ${path}`)
    const watcher = chokidar.watch(path, {
      persistent: true,
    });

    watcher.on('change', async (path) => {
      try {
        this.logger.log(`File [${path}] has been changed.`);
        const content = await this.fileService.getContent(path);
        onChange(content);
      } catch (err) {
        this.logger.error('Error occurred while processing results of the forecasting')
        new BadRequestException('Something went wrong. Please try again');
      }
    });

    return watcher;
  }
}
