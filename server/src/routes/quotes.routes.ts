import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import quoteService from '../services/quote.service.js';
import { Drawing } from '../models/schemas.js';

const router = Router();

// Configure multer for file uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowed = /\.(jpg|jpeg|png|gif|webp|pdf)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  },
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
  },
});

/**
 * POST /api/quotes/upload
 * Upload engineering drawing and generate quotation
 */
router.post('/upload', upload.single('drawing'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[Route] Received drawing upload: ${req.file.originalname}`);

// Create drawing record
    const drawing = new Drawing({
      fileName: req.file.originalname,
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
      filePath: req.file.path,
      status: 'processing',
    });

    // Save and get MongoDB's auto-generated _id
    const savedDrawing = await drawing.save();
    const drawingId = savedDrawing._id!.toString();
    
    console.log(`[Route] Drawing record created: ${drawingId}`);

    const quote = await quoteService.generateQuoteFromDrawing(req.file.path, drawingId);

    console.log(`[Route] Quote generated: ${quote.quoteId}`);

    res.status(200).json({
      success: true,
      message: 'Drawing processed and quote generated',
      data: {
        drawingId,
        quoteId: quote.quoteId,
        baseCost: quote.baseCost,
        marketAdjustment: quote.marketAdjustment,
        finalPrice: quote.finalPrice,
        confidenceScore: quote.confidenceScore,
        breakdown: quote.breakdown,
        extractedSpecs: quote.extractedSpecs,
        analysis: quote.analysis,
      },
    });
  } catch (error) {
    console.error('[Route] Error processing drawing:', error);
    res.status(500).json({
      error: 'Failed to process drawing',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/quotes/analyze-url
 * Analyze drawing from URL (alternative to file upload)
 */
router.post('/analyze-url', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    console.log(`[Route] Analyzing drawing from URL: ${imageUrl}`);

    // TODO: Download image from URL and save locally, then process
    res.status(501).json({ error: 'URL analysis not implemented yet' });
  } catch (error) {
    console.error('[Route] Error analyzing URL:', error);
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
});

/**
 * GET /api/quotes/:quoteId
 * Fetch generated quote
 */
router.get('/:quoteId', async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params;

    const quote = await quoteService.getQuote(quoteId);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('[Route] Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

/**
 * PUT /api/quotes/:quoteId/status
 * Update quote status (user review/approval)
 */
router.put('/:quoteId/status', async (req: Request, res: Response) => {
  try {
    const { quoteId } = req.params;
    const { status } = req.body;

    const validStatuses = ['reviewed', 'approved', 'rejected', 'finalized'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses,
      });
    }

    await quoteService.updateQuoteStatus(quoteId, status);

    res.status(200).json({
      success: true,
      message: `Quote status updated to ${status}`,
    });
  } catch (error) {
    console.error('[Route] Error updating quote status:', error);
    res.status(500).json({ error: 'Failed to update quote status' });
  }
});

/**
 * POST /api/quotes/batch
 * Generate quotes for multiple drawings
 */
router.post('/batch', upload.array('drawings', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`[Route] Processing batch upload: ${req.files.length} drawings`);

    const quotes = await quoteService.generateBulkQuotes(
      (req.files as Express.Multer.File[]).map((f) => f.path)
    );

    res.status(200).json({
      success: true,
      message: `Generated ${quotes.length} quotes`,
      data: quotes,
    });
  } catch (error) {
    console.error('[Route] Error processing batch:', error);
    res.status(500).json({ error: 'Failed to process batch' });
  }
});

export default router;
