import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import dotenv from 'dotenv';
import { z } from 'zod';

import { RulesBasedModel } from './model/rules';
import { LinearRegressionModel } from './model/linear';
import { normalizeLocation, normalizeParcelSize } from './utils/normalize';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

// Validation schemas
const ValuationRequestSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  parcelSize: z.number().positive('Parcel size must be positive'),
  geoJson: z.any().optional(),
  comps: z.array(z.object({
    location: z.string(),
    size: z.number(),
    price: z.number(),
  })).optional(),
  soilScore: z.number().min(0).max(100).optional(),
  infraScore: z.number().min(0).max(100).optional(),
});

type ValuationRequest = z.infer<typeof ValuationRequestSchema>;

interface ValuationResponse {
  fairPricePerShare: number;
  confidence: number;
  featuresUsed: string[];
  methodology: string;
  timestamp: string;
}

// Initialize models
const rulesModel = new RulesBasedModel();
const linearModel = new LinearRegressionModel();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
  }, 'Incoming request');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Main valuation endpoint
app.post('/estimate', async (req, res) => {
  try {
    // Validate request
    const validatedRequest = ValuationRequestSchema.parse(req.body);
    
    logger.info({
      location: validatedRequest.location,
      parcelSize: validatedRequest.parcelSize,
    }, 'Processing valuation request');

    // Normalize inputs
    const normalizedLocation = normalizeLocation(validatedRequest.location);
    const normalizedParcelSize = normalizeParcelSize(validatedRequest.parcelSize);

    // Get predictions from both models
    const [rulesPrediction, linearPrediction] = await Promise.all([
      rulesModel.predict({
        location: normalizedLocation,
        parcelSize: normalizedParcelSize,
        geoJson: validatedRequest.geoJson,
        comps: validatedRequest.comps,
        soilScore: validatedRequest.soilScore,
        infraScore: validatedRequest.infraScore,
      }),
      linearModel.predict({
        location: normalizedLocation,
        parcelSize: normalizedParcelSize,
        geoJson: validatedRequest.geoJson,
        comps: validatedRequest.comps,
        soilScore: validatedRequest.soilScore,
        infraScore: validatedRequest.infraScore,
      }),
    ]);

    // Combine predictions (weighted average)
    const rulesWeight = 0.6;
    const linearWeight = 0.4;
    
    const combinedPrice = (rulesPrediction.price * rulesWeight) + (linearPrediction.price * linearWeight);
    const combinedConfidence = (rulesPrediction.confidence * rulesWeight) + (linearPrediction.confidence * linearWeight);

    // Determine features used
    const featuresUsed = [
      'location',
      'parcelSize',
      'rules_based_model',
      'linear_regression_model',
    ];

    if (validatedRequest.comps && validatedRequest.comps.length > 0) {
      featuresUsed.push('comparable_sales');
    }
    if (validatedRequest.soilScore !== undefined) {
      featuresUsed.push('soil_score');
    }
    if (validatedRequest.infraScore !== undefined) {
      featuresUsed.push('infrastructure_score');
    }
    if (validatedRequest.geoJson) {
      featuresUsed.push('geospatial_data');
    }

    const response: ValuationResponse = {
      fairPricePerShare: Math.round(combinedPrice * 100) / 100,
      confidence: Math.round(combinedConfidence * 100) / 100,
      featuresUsed,
      methodology: 'hybrid_rules_linear',
      timestamp: new Date().toISOString(),
    };

    logger.info({
      fairPricePerShare: response.fairPricePerShare,
      confidence: response.confidence,
      featuresUsed: response.featuresUsed,
    }, 'Valuation completed');

    res.json(response);
  } catch (error) {
    logger.error({ error: error.message }, 'Valuation request failed');
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }
});

// Stats endpoint
app.get('/stats', (req, res) => {
  res.json({
    totalValuations: rulesModel.getStats().totalPredictions + linearModel.getStats().totalPredictions,
    averageConfidence: (rulesModel.getStats().averageConfidence + linearModel.getStats().averageConfidence) / 2,
    lastUpdated: new Date().toISOString(),
    models: {
      rules: rulesModel.getStats(),
      linear: linearModel.getStats(),
    },
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: error.message, stack: error.stack }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Valuation microservice running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`📈 Stats: http://localhost:${PORT}/stats`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});