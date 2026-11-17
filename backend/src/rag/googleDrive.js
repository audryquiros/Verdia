import path from 'node:path';
import { google } from 'googleapis';
import { env } from '../config/env.js';
import { extractText } from './textExtractor.js';

const DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const SAFE_ID = /^[A-Za-z0-9_-]+$/;

const EXPORTS = new Map([
  ['application/vnd.google-apps.document', { mimeType: 'text/plain', extension: '.txt' }],
  ['application/vnd.google-apps.spreadsheet', { mimeType: 'text/csv', extension: '.csv' }],
  ['application/vnd.google-apps.presentation', { mimeType: 'text/plain', extension: '.txt' }],
]);

const TEXT_MIME_PREFIXES = ['text/'];
const DIRECT_TEXT_MIME_TYPES = new Set([
  'application/json',
  'application/xml',
  'application/javascript',
]);

function assertFolderId(folderId) {
  if (!folderId || !SAFE_ID.test(folderId)) {
    throw new Error('Invalid Google Drive folder ID');
  }
}

function credentialPath() {
  if (!env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not configured');
  }
  return path.resolve(process.cwd(), env.GOOGLE_APPLICATION_CREDENTIALS);
}

function createDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialPath(),
    scopes: [DRIVE_READONLY_SCOPE],
  });

  return google.drive({ version: 'v3', auth });
}

async function listChildren(drive, folderId) {
  const files = [];
  let pageToken;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: 1000,
      pageToken,
      orderBy: 'name',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,md5Checksum,webViewLink,parents)',
    });

    files.push(...(response.data.files || []));
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return files;
}

export class GoogleDriveSource {
  constructor(config = {}) {
    this.folderId = config.folderId || env.GOOGLE_DRIVE_FOLDER_ID;
    this.drive = config.drive || createDriveClient();
  }

  async listAuthorizedFiles() {
    assertFolderId(this.folderId);

    const result = [];
    const visitedFolders = new Set();
    const queue = [this.folderId];

    while (queue.length) {
      const folderId = queue.shift();
      if (visitedFolders.has(folderId)) continue;
      visitedFolders.add(folderId);

      const files = await listChildren(this.drive, folderId);
      for (const file of files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          queue.push(file.id);
          continue;
        }
        result.push(file);
      }
    }

    return result;
  }

  async getFileContent(file) {
    if (!file?.id || !SAFE_ID.test(file.id)) {
      throw new Error('Invalid Google Drive file ID');
    }

    const exportConfig = EXPORTS.get(file.mimeType);
    if (exportConfig) {
      const response = await this.drive.files.export({
        fileId: file.id,
        mimeType: exportConfig.mimeType,
      });
      return {
        buffer: Buffer.from(String(response.data), 'utf8'),
        text: String(response.data),
        mimeType: exportConfig.mimeType,
        extension: exportConfig.extension,
      };
    }

    if (TEXT_MIME_PREFIXES.some((prefix) => file.mimeType?.startsWith(prefix)) || DIRECT_TEXT_MIME_TYPES.has(file.mimeType)) {
      const response = await this.drive.files.get(
        { fileId: file.id, alt: 'media', supportsAllDrives: true },
        { responseType: 'arraybuffer' }
      );
      const buffer = Buffer.from(response.data);
      return {
        buffer,
        text: buffer.toString('utf8'),
        mimeType: file.mimeType,
        extension: path.extname(file.name || ''),
      };
    }


    const response = await this.drive.files.get(
      { fileId: file.id, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' }
    );
    const buffer = Buffer.from(response.data);
    const text = await extractText({
      buffer,
      mimeType: file.mimeType,
      fileName: file.name,
    });

    return {
      buffer,
      text,
      mimeType: file.mimeType,
      extension: path.extname(file.name || ''),
    };
  }
}
