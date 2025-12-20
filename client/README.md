# AI Manufacturing Quotation System - Frontend

A modern, production-ready Next.js frontend for automated manufacturing quotation generation using AI.

## 🎯 Features

- **AI-Powered Quotation Generation** - Upload engineering drawings, get instant quotations
- **Drawing Analysis** - Automatic detection of dimensions, materials, and complexity
- **Cost Estimation** - Smart cost breakdown with material, labor, and overhead calculations
- **Market Price Integration** - Real-time market price analysis and forecasting
- **AWS Cognito Authentication** - Secure user authentication with Google OAuth
- **Responsive Design** - Mobile-friendly interface with TailwindCSS
- **Real-time Updates** - RTK Query for efficient data fetching and caching
- **TypeScript** - Full type safety throughout the application
- **Form Validation** - Zod-powered schema validation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: TailwindCSS
- **Authentication**: AWS Amplify + Cognito
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd ai-project-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your AWS credentials

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📖 Setup Guide

For detailed step-by-step setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🚀 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint
```

### Environment Variables

Create `.env.local` with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_COGNITO_DOMAIN=your_cognito_domain
NEXT_PUBLIC_AWS_REGION=ap-southeast-1
NEXT_PUBLIC_AWS_S3_BUCKET=your_bucket_name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/              # Next.js pages and layouts
│   ├── page.tsx     # Dashboard
│   ├── upload/      # Drawing upload
│   ├── quotation/   # Quotation details
│   ├── history/     # Quotation history
│   └── layout.tsx   # Root layout
├── components/       # Reusable React components
├── services/         # API and business logic services
│   ├── auth.service.ts
│   └── drawing.service.ts
├── state/            # Redux store and API slices
│   ├── api.ts       # RTK Query endpoints
│   └── store.ts     # Redux store config
├── types/            # TypeScript type definitions
├── lib/              # Utility libraries
│   └── validations.ts # Zod schemas
├── utils/            # Helper functions
│   └── helpers.ts
└── globals.css       # Global styles
```

## 🔌 API Integration

### Backend Requirements

The backend should expose the following endpoints:

```
POST   /api/drawings/upload              # Upload drawing
POST   /api/drawings/upload-multiple      # Upload multiple
GET    /api/quotations                    # List quotations
POST   /api/quotations/generate/:requestId # Generate quotation
GET    /api/quotations/:id                # Get quotation
POST   /api/auth/profile                  # Get user profile
```

See backend documentation for complete API specification.

## 🔐 Authentication Flow

1. User lands on app
2. Amplify redirects to Cognito login
3. User authenticates with Google or Cognito
4. JWT token stored securely
5. All API requests include Authorization header
6. Token refreshed automatically

## 📱 Key Pages

### Dashboard (`/`)
- Overview of user's quotations
- Recent activity
- Quick action buttons

### Upload Drawing (`/upload`)
- Drag-and-drop file upload
- File validation
- Progress indication

### Quotation Details (`/quotation/[id]`)
- Drawing analysis results
- Cost breakdown
- Pricing recommendations
- Market analysis

### History (`/history`)
- List of all quotations
- Search and filter
- Pagination
- Export options

## 🎨 Styling

Uses TailwindCSS with custom color schemes:

- **Primary**: Sky blue (500-900)
- **Secondary**: Purple (500-900)
- **Success**: Green (50-900)
- **Warning**: Amber (50-900)
- **Danger**: Red (50-900)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t ai-quotation-frontend .
docker run -p 3000:3000 ai-quotation-frontend
```

### Traditional Hosting

```bash
npm run build
npm start
```

## 📊 Performance

- **Code Splitting**: Automatic per-page splitting
- **Image Optimization**: Next.js Image component
- **API Caching**: RTK Query with smart cache invalidation
- **Type Safety**: Full TypeScript coverage

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting) for common issues and solutions.

## 📝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Review backend documentation
- Check AWS Amplify docs

---

**Last Updated**: December 2025  
**Frontend Version**: 1.0.0  
**Backend Compatibility**: v1.0.0+
