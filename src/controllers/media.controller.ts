import { Request, Response } from "express";
import { mediaService, UPLOADS_DIR } from "../services/media.service";
import path from "path";
import fs from "fs";
import multer from "multer";
import { randomUUID } from "crypto";

// Ensure uploads dir exists before setting up multer
mediaService.ensureUploadsDir().catch(console.error);

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'Uncategorized';
    const destDir = path.join(UPLOADS_DIR, folder);
    
    // Ensure the folder exists
    fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

export const uploadMiddleware = multer({ storage });

export const getMediaFiles = async (req: Request, res: Response) => {
  try {
    const { folder, page = 1, limit = 20 } = req.query;
    const media = await mediaService.getMediaFiles(
      folder as string, 
      Number(page), 
      Number(limit)
    );
    res.json(media);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createMediaRecord = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const folder = req.body.folder || 'Uncategorized';
    const filename = req.file.filename;
    const key = `${folder}/${filename}`;
    const publicUrl = `/api/v1/media/view?key=${encodeURIComponent(key)}`;

    // Upload to S3 for persistent cloud storage
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      await mediaService.uploadToS3(key, fileBuffer, req.file.mimetype);
    } catch (s3Err) {
      console.warn(`[Media Upload] S3 upload skipped or failed for ${key}:`, s3Err);
    }

    const data = {
      name: req.file.originalname,
      type: req.file.mimetype,
      folder,
      size: req.file.size,
      url: publicUrl,
      key
    };

    const record = await mediaService.createMediaRecord(data);
    res.status(201).json(record);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteMediaFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await mediaService.deleteMediaFile(id as string);
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.webm') return 'video/webm';
  return 'application/octet-stream';
}

export const viewMediaFile = async (req: Request, res: Response) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: "Media key is required" });
    }

    // Security: Prevent directory traversal
    const safeKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(UPLOADS_DIR, safeKey);

    // 1. Check local disk cache first
    if (absolutePath.startsWith(UPLOADS_DIR) && fs.existsSync(absolutePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.sendFile(absolutePath);
    }

    // Determine content type fallback
    const resolvedMime = getMimeType(safeKey);

    // 2. Fetch from S3 directly if missing locally
    const s3Object = await mediaService.getFromS3(safeKey);
    if (s3Object && s3Object.stream) {
      const mime = (s3Object.contentType && !s3Object.contentType.includes('octet-stream'))
        ? s3Object.contentType
        : resolvedMime;
      res.setHeader('Content-Type', mime);
      if (s3Object.contentLength) {
        res.setHeader('Content-Length', s3Object.contentLength.toString());
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      s3Object.stream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to stream media" });
        }
      });
      return s3Object.stream.pipe(res);
    }

    // 3. Fallback: check alternative folders in S3 (e.g. products/, hero-image/)
    const cleanFilename = path.basename(safeKey);
    const altKeys = [
      `products/${cleanFilename}`,
      `hero-image/${cleanFilename}`,
      cleanFilename,
    ];
    for (const altKey of altKeys) {
      const altObj = await mediaService.getFromS3(altKey);
      if (altObj && altObj.stream) {
        const altMime = (altObj.contentType && !altObj.contentType.includes('octet-stream'))
          ? altObj.contentType
          : getMimeType(altKey);
        res.setHeader('Content-Type', altMime);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        altObj.stream.on('error', (err) => {
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to stream media" });
          }
        });
        return altObj.stream.pipe(res);
      }
    }

    res.status(404).json({ error: "File not found" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to serve media file" });
  }
};

export const syncLocal = async (req: Request, res: Response) => {
  try {
    const result = await mediaService.syncLocalFiles();
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to sync local files" });
  }
};
