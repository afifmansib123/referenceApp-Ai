import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Don't initialize here - wait until first use
let genAI: GoogleGenerativeAI | null = null;

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

export class GeminiService {
  /**
   * Initialize Gemini client on first use (lazy loading)
   */
  private initializeGenAI() {
    if (genAI) return; // Already initialized

    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('[GeminiService] Initializing...');
    console.log('[GeminiService] API Key exists:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('[GeminiService] ✓ Initialized successfully');
  }

  /**
   * Analyze engineering drawing image and extract specifications
   * Works with any manufacturing drawing (generic approach - Phase 1)
   */
  async analyzeDrawing(filePath: string): Promise<DrawingSpecs> {
    try {
      // Initialize on first use
      this.initializeGenAI();
      
      if (!genAI) {
        throw new Error('Gemini client not initialized');
      }

      // Read image file
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      // Determine mime type from file extension
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = this.getMimeType(ext);

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are an expert manufacturing engineer analyzing technical drawings.

Extract the following information from this engineering drawing:

1. MATERIAL: What material(s) are used? (e.g., aluminum, steel, plastic)
2. QUANTITY: How much material is needed? (provide number and unit)
3. DIMENSIONS: What are the key dimensions? (length, width, height in appropriate units)
4. MANUFACTURING PROCESS: What processes are required? (e.g., CNC machining, welding, casting, 3D printing)
5. COMPLEXITY: Rate the complexity from 1-10 (1=simple, 10=extremely complex)
6. SPECIAL REQUIREMENTS: Any special requirements? (e.g., surface finish, tolerance, certifications)

Respond in JSON format ONLY, no other text:
{
  "material": "material name",
  "materialQuantity": number,
  "materialUnit": "kg/lb/m3/etc",
  "dimensions": {
    "length": number,
    "width": number,
    "height": number,
    "unit": "mm/cm/inch/etc"
  },
  "manufacturingProcess": ["process1", "process2"],
  "complexity": number,
  "specialRequirements": ["requirement1", "requirement2"],
  "confidence": number
}

If any field cannot be determined, use null or empty array.
Confidence should be 0-100 indicating how confident you are in the extraction.`;

      const response = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ]);

      const responseText = response.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from Gemini response');
      }

      const specs = JSON.parse(jsonMatch[0]) as DrawingSpecs;
      
      // Validate and clean response
      return this.validateSpecs(specs);
    } catch (error) {
      console.error('Error analyzing drawing with Gemini:', error);
      throw error;
    }
  }

  /**
   * Validate and normalize extracted specifications
   */
  private validateSpecs(specs: Partial<DrawingSpecs>): DrawingSpecs {
    return {
      material: specs.material || 'Unknown',
      materialQuantity: specs.materialQuantity || 1,
      materialUnit: specs.materialUnit || 'kg',
      dimensions: {
        length: specs.dimensions?.length || 0,
        width: specs.dimensions?.width || 0,
        height: specs.dimensions?.height || 0,
        unit: specs.dimensions?.unit || 'mm',
      },
      manufacturingProcess: specs.manufacturingProcess || [],
      complexity: Math.min(Math.max(specs.complexity || 5, 1), 10), // Clamp 1-10
      specialRequirements: specs.specialRequirements || [],
      confidence: Math.min(Math.max(specs.confidence || 50, 0), 100), // Clamp 0-100
    };
  }

  /**
   * Determine MIME type from file extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Batch analyze multiple drawings
   */
  async analyzeDrawingsBatch(filePaths: string[]): Promise<DrawingSpecs[]> {
    const results: DrawingSpecs[] = [];
    
    for (const filePath of filePaths) {
      try {
        const specs = await this.analyzeDrawing(filePath);
        results.push(specs);
      } catch (error) {
        console.error(`Failed to analyze ${filePath}:`, error);
        results.push({
          material: 'ERROR',
          materialQuantity: 0,
          materialUnit: '',
          dimensions: { length: 0, width: 0, height: 0, unit: '' },
          manufacturingProcess: [],
          complexity: 0,
          specialRequirements: [],
          confidence: 0,
        });
      }
    }
    
    return results;
  }
}

export default new GeminiService();