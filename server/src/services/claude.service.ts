import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

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

// Generic manufacturing cost database (Phase 1)
const MATERIAL_COSTS: Record<string, number> = {
  aluminum: 3.5, // $ per kg
  steel: 1.2, // $ per kg
  stainless_steel: 5.0, // $ per kg
  copper: 8.5, // $ per kg
  plastic: 0.8, // $ per kg
  titanium: 15.0, // $ per kg
  brass: 6.0, // $ per kg
};

const LABOR_RATES: Record<string, number> = {
  cnc: 50, // $ per hour
  welding: 45, // $ per hour
  casting: 35, // $ per hour
  milling: 48, // $ per hour
  turning: 40, // $ per hour
  assembly: 30, // $ per hour
  "3d_printing": 60, // $ per hour
};

const COMPLEXITY_TIME_MULTIPLIER = {
  1: 0.5, // Very simple - 30 min minimum
  2: 0.75,
  3: 1.0,
  4: 1.25,
  5: 1.5,
  6: 2.0,
  7: 2.5,
  8: 3.5,
  9: 4.5,
  10: 6.0, // Very complex - 6 hours
};

export class ClaudeService {
  /**
   * Initialize Claude client on first use (lazy loading)
   */
  private initializeClient() {
    if (client) return; // Already initialized

    const apiKey = process.env.CLAUDE_API_KEY;

    console.log("[ClaudeService] Initializing...");
    console.log("[ClaudeService] API Key exists:", !!apiKey);

    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY environment variable is not set");
    }

    client = new Anthropic({ apiKey });
    console.log("[ClaudeService] ✓ Initialized successfully");
  }

  /**
   * Calculate manufacturing cost based on extracted drawing specs
   * Uses generic manufacturing knowledge (Phase 1)
   */
  async calculateCost(specs: DrawingSpecs): Promise<CostBreakdown> {
    try {
      // Calculate material cost
      const normalizedMaterial = specs.material
        .toLowerCase()
        .replace(/\s+/g, "_");
      const unitCost = MATERIAL_COSTS[normalizedMaterial] || 5; // Default fallback
      const materialTotalCost = specs.materialQuantity * unitCost;

      // Calculate labor cost
      const baseHours =
        COMPLEXITY_TIME_MULTIPLIER[
          specs.complexity as keyof typeof COMPLEXITY_TIME_MULTIPLIER
        ] || 2;

      // Get average labor rate for manufacturing processes
      const laborRates = specs.manufacturingProcess.map(
        (process) => LABOR_RATES[process.toLowerCase()] || 45
      );
      const avgHourlyRate =
        laborRates.length > 0
          ? laborRates.reduce((a, b) => a + b, 0) / laborRates.length
          : 45;

      const laborTotalCost = baseHours * avgHourlyRate;

      // Calculate overhead (30% of direct costs)
      const overheadPercentage = 30;
      const directCosts = materialTotalCost + laborTotalCost;
      const overheadCost = (directCosts * overheadPercentage) / 100;

      // Total base cost
      const baseCost = materialTotalCost + laborTotalCost + overheadCost;

      return {
        material: {
          description: specs.material,
          quantity: specs.materialQuantity,
          unitCost: unitCost,
          totalCost: materialTotalCost,
        },
        labor: {
          hours: baseHours,
          hourlyRate: avgHourlyRate,
          totalCost: laborTotalCost,
        },
        overhead: {
          percentage: overheadPercentage,
          totalCost: overheadCost,
        },
        baseCost: baseCost,
      };
    } catch (error) {
      console.error("Error calculating cost:", error);
      throw error;
    }
  }

  /**
   * Use Claude to generate detailed cost analysis and reasoning
   * Provides transparency into how cost was calculated
   */
  async generateCostAnalysis(
    specs: DrawingSpecs,
    costBreakdown: CostBreakdown
  ): Promise<string> {
    try {
      this.initializeClient(); // Initialize on first use

      if (!client) {
        throw new Error("Claude client not initialized");
      }

      const prompt = `You are a manufacturing cost analyst. Based on the following product specifications and cost breakdown, provide a brief professional analysis (2-3 sentences) of why this cost estimate is reasonable.

Product Specifications:
- Material: ${specs.material} (${specs.materialQuantity} ${specs.materialUnit})
- Dimensions: ${specs.dimensions.length}x${specs.dimensions.width}x${
        specs.dimensions.height
      } ${specs.dimensions.unit}
- Manufacturing Processes: ${specs.manufacturingProcess.join(", ")}
- Complexity Level: ${specs.complexity}/10
- Special Requirements: ${specs.specialRequirements.join(", ") || "None"}

Cost Breakdown:
- Material Cost: $${costBreakdown.material.totalCost.toFixed(2)}
- Labor Cost: $${costBreakdown.labor.totalCost.toFixed(2)} (${
        costBreakdown.labor.hours
      } hours @ $${costBreakdown.labor.hourlyRate}/hr)
- Overhead (${
        costBreakdown.overhead.percentage
      }%): $${costBreakdown.overhead.totalCost.toFixed(2)}
- Total Base Cost: $${costBreakdown.baseCost.toFixed(2)}

Provide a brief, professional justification for this cost estimate.`;

      const message = await client.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0];
      if (responseText.type === "text") {
        return responseText.text;
      }
      return "Cost analysis generated";
    } catch (error) {
      console.error("Error generating cost analysis:", error);
      return "Unable to generate analysis at this time";
    }
  }

  /**
   * Validate and sanitize extracted text from drawing specs
   */
  async validateSpecs(rawSpecs: Partial<DrawingSpecs>): Promise<DrawingSpecs> {
    try {
      this.initializeClient(); // Initialize on first use

      if (!client) {
        throw new Error("Claude client not initialized");
      }

      const prompt = `You are a manufacturing expert. Validate and correct these extracted drawing specifications if needed.

Raw Specifications:
${JSON.stringify(rawSpecs, null, 2)}

Return ONLY valid JSON in this exact format, correcting any obvious errors:
{
  "material": "corrected material name",
  "materialQuantity": number,
  "materialUnit": "unit",
  "dimensions": {
    "length": number,
    "width": number,
    "height": number,
    "unit": "unit"
  },
  "manufacturingProcess": ["process1", "process2"],
  "complexity": number between 1-10,
  "specialRequirements": ["requirement1"],
  "confidence": number between 0 and 1
}`;

      const message = await client.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0];
      if (responseText.type === "text") {
        const jsonMatch = responseText.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as DrawingSpecs;
          if (!parsed.confidence) parsed.confidence = 0.8;
          return parsed;
        }
      }

      // Fallback to original if validation fails
      const fallback = rawSpecs as DrawingSpecs;
      if (!fallback.confidence) fallback.confidence = 0.5;
      return fallback;
    } catch (error) {
      console.error("Error validating specs:", error);
      throw error;
    }
  }

  /**
   * Batch process multiple cost calculations
   */
  async calculateCostsBatch(
    specsList: DrawingSpecs[]
  ): Promise<CostBreakdown[]> {
    const results: CostBreakdown[] = [];

    for (const specs of specsList) {
      try {
        const cost = await this.calculateCost(specs);
        results.push(cost);
      } catch (error) {
        console.error("Error calculating cost for batch:", error);
        results.push({
          material: { description: "", quantity: 0, unitCost: 0, totalCost: 0 },
          labor: { hours: 0, hourlyRate: 0, totalCost: 0 },
          overhead: { percentage: 0, totalCost: 0 },
          baseCost: 0,
        });
      }
    }

    return results;
  }
}

export default new ClaudeService();
