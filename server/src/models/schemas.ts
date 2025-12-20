import mongoose from 'mongoose';

// Drawing Schema - stores uploaded engineering drawings
export const drawingSchema = new mongoose.Schema({
  _id: {
  type: mongoose.Schema.Types.ObjectId,
  auto: true
},
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image', 'cad'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'failed'],
    default: 'uploaded'
  },
  extractedSpecs: {
    material: String,
    materialQuantity: Number,
    materialUnit: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String
    },
    manufacturingProcess: [String], // e.g., ['CNC', 'welding']
    complexity: Number, // 1-10 scale
    specialRequirements: [String],
    confidence: Number // 0-100 score from AI
  },
  processingTime: Number, // in milliseconds
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Quote Schema - stores generated quotations
export const quoteSchema = new mongoose.Schema({
  _id: {
  type: mongoose.Schema.Types.ObjectId,
  auto: true
},
  drawingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drawing',
    required: true
  },
  baseCost: {
    type: Number,
    required: true
  },
  materialCost: Number,
  laborCost: Number,
  overheadCost: Number,
  marketAdjustment: {
    factor: Number, // e.g., 1.05 for 5% increase
    reason: String, // e.g., "Aluminum price up 5%"
    dataSource: String // e.g., "CRB Index"
  },
  finalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  breakdown: {
    material: {
      description: String,
      quantity: Number,
      unitCost: Number,
      totalCost: Number
    },
    labor: {
      hours: Number,
      hourlyRate: Number,
      totalCost: Number
    },
    overhead: {
      percentage: Number,
      totalCost: Number
    }
  },
  status: {
    type: String,
    enum: ['generated', 'reviewed', 'approved', 'rejected', 'finalized'],
    default: 'generated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Historical Quote Schema - for client-specific learning (Phase 2)
export const historicalQuoteSchema = new mongoose.Schema({
  _id: {
  type: mongoose.Schema.Types.ObjectId,
  auto: true
},
  clientId: {
    type: String,
    required: true // e.g., 'inada_manufacturing'
  },
  drawingSpecs: {
    material: String,
    materialQuantity: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    manufacturingProcess: [String],
    complexity: Number
  },
  quotedPrice: {
    type: Number,
    required: true
  },
  actualPrice: Number, // actual amount paid
  profitMargin: Number,
  timestamp: {
    type: Date,
    required: true
  },
  notes: String,
  isAccurate: {
    type: Boolean,
    default: true
  }
});

// Review Feedback Schema - for AI learning
export const reviewSchema = new mongoose.Schema({
  _id: {
  type: mongoose.Schema.Types.ObjectId,
  auto: true
},
  quoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: true
  },
  aiGeneratedPrice: Number,
  userCorrectedPrice: Number,
  difference: Number,
  percentageDifference: Number,
  feedback: String,
  isAccurate: Boolean,
  reviewedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: String, // username or ID
  clientId: String // for Phase 2 fine-tuning
});

// Market Data Schema - stores commodity prices for adjustments
export const marketDataSchema = new mongoose.Schema({
  _id: {
  type: mongoose.Schema.Types.ObjectId,
  auto: true
},
  commodity: {
    type: String,
    required: true // e.g., 'aluminum', 'steel', 'copper'
  },
  price: {
    type: Number,
    required: true
  },
  unit: String, // e.g., 'per ton', 'per kg'
  priceDate: {
    type: Date,
    required: true
  },
  source: String, // e.g., 'CRB', 'LME'
  trend: Number, // percentage change from previous
  fetchedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
export const Drawing = mongoose.model('Drawing', drawingSchema);
export const Quote = mongoose.model('Quote', quoteSchema);
export const HistoricalQuote = mongoose.model('HistoricalQuote', historicalQuoteSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const MarketData = mongoose.model('MarketData', marketDataSchema);
