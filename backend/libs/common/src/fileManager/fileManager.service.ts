import { Injectable, Logger } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileManagerService {
  private readonly logger = new Logger('FileManager');

  async getContent(path: string) {
    const content = await fs.promises.readFile(path, 'utf-8');
    return content;
  }

  isDirExist(folderPath: string) {
    return fs.existsSync(folderPath);
  }

  createFolder(folderPath: string) {

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    this.logger.log(`Folder [${folderPath}] was created successfully.`);

    return folderPath;
  }

  createFile(fileName: string, data: any, folderPath?: string) {
    const filePath = path.join(folderPath, fileName);

    // Write JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    this.logger.log(`File with name: ${fileName} [${filePath}] was created with JSON data.`);

    return filePath;
  }

  async removeFolder(folderPath: string) {
    // Check if the directory exists
    if (fs.existsSync(folderPath)) {
      try {
        // Recursively remove the directory and its contents
        await fs.promises.rm(folderPath, { recursive: true });
        this.logger.log(`Directory [${folderPath}] and all contents removed.`);
      } catch (error) {
        this.logger.error(`Error removing directory [${folderPath}]:`, error);
      }
    }
  }

  removeFile(fileName: string, folderPath?: string) {
    const filePath = path.join(folderPath, fileName);

    // Remove the file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`File with name: ${fileName} [${filePath}] was removed.`);
    }
    this.logger.log(`There is no such file with name: ${fileName} [${filePath}]`);
  }
}