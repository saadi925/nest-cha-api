import { MultipartFile } from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private basePath = join(__dirname, '..', '..', 'uploads');

  constructor() {
    if (!existsSync(this.basePath)) {
      mkdirSync(this.basePath, { recursive: true });
    }
  }

  async saveFile(userId: string, file :MultipartFile) {
    const userDir = join(this.basePath, userId);
    if (!existsSync(userDir)) {
      mkdirSync(userDir);
    }
    const fileBuffer = await file.toBuffer()

    const filePath = join(userDir, file.filename);
    writeFileSync(filePath, fileBuffer);

    const base64 = await this.getFileBase64(filePath);
    return base64;
  }

  getFilePath(userId: string, filename: string): string {
    return join(this.basePath, userId, filename);
  }

  userCanAccessFile(userId: string, filename: string): boolean {
    const filePath = this.getFilePath(userId, filename);
    return existsSync(filePath);
  }
  private async getFileBase64(filePath : string): Promise<string | null> {
    try {
      const fileContent = await readFile(filePath);
      const base64Data = fileContent.toString('base64');
      return base64Data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // File not found
      } else {
        throw error;
      }
    }
  }
}
