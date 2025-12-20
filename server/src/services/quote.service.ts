import { Quote, Drawing } from "../models/schemas.js";
import geminiService from "./gemini.service.js";
import claudeService from "./claude.service.js";
import marketDataService from "./market.service.js";
import { v4 as uuidv4 } from "uuid";

interface DrawingSpecs {
  material: string;
  materialQuantity: number;
  materialUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  manufacturingProcess: string[];
  complexity: number;
  specialRequirements: string[];
  confidence: number;
}

interface CostBreakdown {
  material: {
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  labor: {
    hours: number;
    hourlyRate: number;
    totalCost: number;
  };
  overhead: {
    percentage: number;
    totalCost: number;
  };
  baseCost: number;
}

interface QuoteResult {
  quoteId: string;
  baseCost: number;
  marketAdjustment: {
    factor: number;
    reason: string;
    dataSource: string;
  };
  finalPrice: number;
  breakdown: CostBreakdown;
  confidenceScore: number;
  extractedSpecs: DrawingSpecs;
  analysis: string;
}

export class QuoteService {
  /**
   * Generate complete quotation from drawing
   * Pipeline: Drawing → Gemini Analysis → Claude Cost Calc → Market Adjustment → Quote
   */
  async generateQuoteFromDrawing(
    drawingFilePath: string,
    drawingId?: string
  ): Promise<QuoteResult> {
    const startTime = Date.now();
    let quoteId = uuidv4();

    try {
      console.log(
        `[Quote Service] Starting quote generation for ${drawingFilePath}`
      );

      // Step 1: Analyze drawing with Gemini
      console.log("[Step 1] Analyzing drawing with Gemini...");
      const extractedSpecs = await geminiService.analyzeDrawing(
        drawingFilePath
      );
      console.log("[Step 1] ✓ Drawing analyzed:", extractedSpecs);

      // Step 2: Validate specs with Claude
      console.log("[Step 2] Validating specs with Claude...");
      const validatedSpecs = await claudeService.validateSpecs(extractedSpecs);

      if (!validatedSpecs.confidence) {
        validatedSpecs.confidence = extractedSpecs.confidence || 0.5;
      }

      console.log("[Step 2] ✓ Specs validated");

      // Step 3: Calculate base cost
      console.log("[Step 3] Calculating base cost...");
      const costBreakdown = await claudeService.calculateCost(validatedSpecs);
      console.log("[Step 3] ✓ Cost calculated:", costBreakdown.baseCost);

      // Step 4: Get market adjustment
      console.log("[Step 4] Getting market adjustment...");
      const marketAdjustment =
        await marketDataService.calculateMarketAdjustment(
          validatedSpecs.material
        );
      console.log(
        "[Step 4] ✓ Market adjustment applied:",
        marketAdjustment.factor
      );

      // Step 5: Calculate final price
      const finalPrice = costBreakdown.baseCost * marketAdjustment.factor;

      // Step 6: Generate analysis
      console.log("[Step 5] Generating cost analysis...");
      const analysis = await claudeService.generateCostAnalysis(
        validatedSpecs,
        costBreakdown
      );
      console.log("[Step 5] ✓ Analysis generated");

      // Calculate confidence score (average of extraction confidence and cost analysis confidence)
      const confidenceScore = extractedSpecs.confidence;

      // Step 7: Save to database
      if (drawingId) {
        await this.saveQuoteToDatabase(
          drawingId,
          quoteId,
          costBreakdown,
          marketAdjustment,
          finalPrice,
          confidenceScore,
          validatedSpecs
        );
      }

      const processingTime = Date.now() - startTime;
      console.log(`[Quote Service] Quote generated in ${processingTime}ms`);

      return {
        quoteId,
        baseCost: costBreakdown.baseCost,
        marketAdjustment,
        finalPrice,
        breakdown: costBreakdown,
        confidenceScore,
        extractedSpecs: validatedSpecs,
        analysis,
      };
    } catch (error) {
      console.error("[Quote Service] Error generating quote:", error);
      throw error;
    }
  }

  /**
   * Save quote to MongoDB
   */
  private async saveQuoteToDatabase(
    drawingId: string,
    quoteId: string,
    costBreakdown: CostBreakdown,
    marketAdjustment: { factor: number; reason: string; dataSource: string },
    finalPrice: number,
    confidenceScore: number,
    extractedSpecs: DrawingSpecs
  ): Promise<void> {
    try {
      const quote = new Quote({
        _id: quoteId,
        drawingId,
        baseCost: costBreakdown.baseCost,
        materialCost: costBreakdown.material.totalCost,
        laborCost: costBreakdown.labor.totalCost,
        overheadCost: costBreakdown.overhead.totalCost,
        marketAdjustment,
        finalPrice,
        confidenceScore,
        breakdown: costBreakdown,
        status: "generated",
      });

      await quote.save();

      // Update drawing status
      await Drawing.findByIdAndUpdate(drawingId, {
        status: "analyzed",
        extractedSpecs,
      });
    } catch (error) {
      console.error("Error saving quote to database:", error);
      // Don't throw - quote was generated successfully, database save is secondary
    }
  }

  /**
   * Generate quote with custom cost rules (for Phase 2 fine-tuning)
   */
  async generateQuoteWithCustomRules(
    drawingFilePath: string,
    clientId: string,
    customRules?: Record<string, any>
  ): Promise<QuoteResult> {
    try {
      // Get base quote
      const quote = await this.generateQuoteFromDrawing(drawingFilePath);

      // Apply custom rules if provided (Phase 2)
      if (customRules) {
        // Apply client-specific adjustments
        if (customRules.profitMarginPercentage) {
          const adjustedPrice =
            quote.finalPrice * (1 + customRules.profitMarginPercentage / 100);
          quote.finalPrice = adjustedPrice;
        }
      }

      return quote;
    } catch (error) {
      console.error("Error generating quote with custom rules:", error);
      throw error;
    }
  }

  /**
   * Generate bulk quotes
   */
  async generateBulkQuotes(drawingFilePaths: string[]): Promise<QuoteResult[]> {
    const results: QuoteResult[] = [];

    for (const filePath of drawingFilePaths) {
      try {
        const quote = await this.generateQuoteFromDrawing(filePath);
        results.push(quote);
      } catch (error) {
        console.error(`Error generating quote for ${filePath}:`, error);
      }
    }

    return results;
  }

  /**
   * Get quote by ID
   */
  async getQuote(quoteId: string): Promise<any> {
    try {
      return await Quote.findById(quoteId);
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw error;
    }
  }

  /**
   * Update quote status (for user reviews)
   */
  async updateQuoteStatus(
    quoteId: string,
    status: "reviewed" | "approved" | "rejected" | "finalized"
  ): Promise<void> {
    try {
      await Quote.findByIdAndUpdate(quoteId, {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating quote status:", error);
      throw error;
    }
  }
}

export default new QuoteService();
