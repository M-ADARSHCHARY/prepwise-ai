import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { AppError } from '../middleware/AppError.js';

export async function extractTextFromFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.txt') {
    return fs.readFile(filePath, 'utf-8');
  }

  if (extension === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (extension === '.pdf') {
    const fileBuffer = await fs.readFile(filePath);
    const result = await pdfParse(fileBuffer);
    return result.text;
  }

  throw new AppError('Unsupported file type for text extraction', 400);
}

export async function deleteTemporaryFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore deletion failures for temp files; this should not break request flow.
  }
}