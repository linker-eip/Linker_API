/**
 * Copyright (c) Overnight
 */

import FileType from 'file-type'
import { FileValidator } from '@nestjs/common'
import type { Express } from 'express'
import type { MimeType } from 'file-type'

interface FileMimeTypeValidatorOptions {
  mimeTypes: MimeType[]
}

class FileMimeTypeValidator extends FileValidator<FileMimeTypeValidatorOptions> {
  buildErrorMessage(): string {
    return 'Current file format is not supported.'
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (file === undefined) {
      return false
    }

    const fileType = await FileType.fromBuffer(file.buffer)
    if (fileType === undefined) {
      return false
    }

    const { mime } = fileType
    return this.validationOptions.mimeTypes.includes(mime)
  }
}

const SupportedImageMimeTypes: MimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export { FileMimeTypeValidator, SupportedImageMimeTypes }