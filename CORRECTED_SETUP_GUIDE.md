# AI Project Frontend - Setup Guide (CORRECTED)

## ⚠️ IMPORTANT: Backend Structure

Your backend uses `/api/quotes/*` endpoints (not `/api/drawings/*`). This guide reflects that correct structure.

---

## 🎯 What You Have

**Backend**: Express.js with routes in `/src/routes/quotes.routes.ts`
- `POST /api/quotes/upload` - Upload single drawing
- `POST /api/quotes/batch` - Upload multiple drawings  
- `GET /api/quotes/:quoteId` - Get quote by ID
- `GET /api/quotes` - List all quotes
- `PUT /api/quotes/:quoteId/status` - Update quote status

**Frontend**: This Next.js app is now configured to match these endpoints exactly.

---

## 🚀 Quick Start (5 Min)

### 1. Extract the ZIP

```bash
unzip ai-project-frontend.zip
cd ai-project-frontend
```

### 2. Install Dependencies

```bash
npm install
```

Expected output:
```
added 201 packages
```

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# This is already set correctly for your backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

**Note**: Remove AWS Cognito variables if not using auth yet. They're optional.

### 4. Start Frontend

```bash
npm run dev
```

Expected output:
```
> Local:        http://localhost:3000
```

### 5. In Another Terminal - Start Backend

```bash
cd ../server  # or wherever your backend is
npm run dev
```

Expected output:
```
✓ MongoDB connected
Server running on port 5001
```

### 6. Test It

1. Open http://localhost:3000
2. Click "Upload Drawing"
3. Upload a test image/PDF
4. Should see quotation result

---

## 📁 Key Files Modified for Your Backend

### API Configuration
**File**: `src/state/api.ts`

Updated endpoints:
```typescript
baseUrl: "http://localhost:5001/api"

// Upload endpoints
POST /quotes/upload
POST /quotes/batch

// Quote endpoints
GET /quotes/:quoteId
PUT /quotes/:quoteId/status
GET /quotes
```

### Drawing Service
**File**: `src/services/drawing.service.ts`

Updated to use:
```typescript
`${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/upload`
```

### Pages Updated
- **Dashboard** (`/`) - Shows quotes from `/api/quotes`
- **Upload** (`/upload`) - Posts to `/api/quotes/upload`
- **Quotation** (`/quotation/[id]`) - Gets from `/api/quotes/:quoteId`
- **History** (`/history`) - Lists from `/api/quotes`

---

## ✅ Verification Checklist

Run this to verify everything is working:

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Wait for: "Server running on port 5001"

# Terminal 2 - Frontend  
cd ai-project-frontend
npm run dev
# Wait for: "Local: http://localhost:3000"

# Terminal 3 - Test API
curl http://localhost:5001/api/quotes
# Should return: {"data":[]...} or similar
```

---

## 📊 Response Structure Expected

Your backend returns data like this:

```json
{
  "success": true,
  "message": "Drawing processed and quote generated",
  "data": {
    "drawingId": "...",
    "quoteId": "...",
    "baseCost": 10000,
    "marketAdjustment": 500,
    "finalPrice": 10500,
    "confidenceScore": 0.95,
    "breakdown": {...},
    "extractedSpecs": {...},
    "analysis": "..."
  }
}
```

Frontend components automatically display this data.

---

## 🔌 Connecting to Your Backend

### Port Configuration

**Frontend**: http://localhost:3000
**Backend**: http://localhost:5001

If your backend runs on different port, update `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:YOUR_PORT/api
```

### CORS

Ensure your Express backend has CORS configured:

```typescript
app.use(cors({
  origin: 'http://localhost:3000',  // or your frontend URL
  credentials: true,
}));
```

### File Upload

The frontend sends FormData with field name `drawing`:

```typescript
const formData = new FormData();
formData.append("drawing", file);  // ← Important: field name is "drawing"
```

Make sure your multer config matches:

```typescript
upload.single('drawing')  // ← Same name here
```

---

## 📋 Frontend Pages Overview

### 1. Dashboard (`/`)
- Shows total quotes count
- Lists recent quotes in a table
- Quick action buttons
- Responsive grid layout

### 2. Upload (`/upload`)
- Drag-and-drop file upload
- File validation (JPEG, PNG, PDF, TIFF)
- Max 50MB file size
- Shows upload progress
- Redirects to quotation on success

### 3. Quotation Detail (`/quotation/[id]`)
- Shows quote details
- Displays cost breakdown
- Shows extracted specifications
- Shows analysis
- Displays confidence score
- Export to PDF button (ready for implementation)

### 4. History (`/history`)
- Lists all quotes with pagination
- Search functionality
- Status badges
- Click to view details

---

## 🛠️ Customization

### Change API Port

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:YOUR_PORT/api
```

### Change Frontend Port

```bash
npm run dev -- -p 3001
```

### Customize Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    600: '#0284c7', // Your color
  }
}
```

### Add More Pages

```bash
mkdir -p src/app/my-page
touch src/app/my-page/page.tsx
```

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/quotes/upload"

**Solution**: Check backend is running on port 5001
```bash
curl http://localhost:5001/health
# Should return: {"status": "OK"...}
```

### Issue: CORS error

**Solution**: Add CORS to backend:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Port 3000 already in use

**Solution**: Kill existing process or use different port
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: File upload fails

**Solution**: Check:
1. Backend multer configuration uses `'drawing'` field name
2. Max file size in backend matches frontend (50MB default)
3. Allowed file types include your format

---

## 📦 Project Structure

```
ai-project-frontend/
├── src/
│   ├── app/                      # Pages
│   │   ├── page.tsx             # Dashboard
│   │   ├── upload/page.tsx       # Upload
│   │   ├── quotation/[id]/page.tsx # Details
│   │   ├── history/page.tsx      # History
│   │   └── layout.tsx            # Root layout
│   ├── state/
│   │   ├── api.ts               # RTK Query (UPDATED for /api/quotes)
│   │   └── store.ts             # Redux store
│   ├── services/
│   │   ├── drawing.service.ts   # Upload logic (UPDATED)
│   │   └── auth.service.ts      # Auth (optional)
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── lib/
│   │   └── validations.ts       # Zod schemas
│   ├── utils/
│   │   └── helpers.ts           # Helper functions
│   └── globals.css              # Styles
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── .env.local.example           # CORRECTED for :5001
└── README.md
```

---

## 🔄 Request/Response Flow

```
User Upload (Frontend)
    ↓
Frontend: POST /api/quotes/upload (FormData)
    ↓
Backend: Multer receives file → quoteService.generateQuoteFromDrawing()
    ↓
Backend: Returns quote data
    ↓
Frontend: RTK Query caches response
    ↓
Frontend: Redirects to /quotation/[quoteId]
    ↓
Frontend: GET /api/quotes/[quoteId]
    ↓
Display quotation details
```

---

## 📝 Environment Variables

### Required
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

### Optional (for future auth)
```env
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=xxx
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=yyy
NEXT_PUBLIC_AWS_COGNITO_DOMAIN=zzz
```

Leave optional ones blank if not using Cognito yet.

---

## ✨ Features Included

✅ File upload with validation
✅ Drag-and-drop interface
✅ Real-time form errors
✅ Quote history with search
✅ Pagination support
✅ Responsive design (mobile-friendly)
✅ TypeScript type safety
✅ RTK Query caching
✅ Loading states
✅ Error handling

---

## 🚀 Deploy to Production

### Build
```bash
npm run build
```

### Verify Build
```bash
npm start
# Visit http://localhost:3000
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
```bash
# Build output is in .next folder
# Deploy that folder to your hosting
```

---

## 📞 Need Help?

1. **Check backend is running**: `curl http://localhost:5001/health`
2. **Check API endpoint**: `curl http://localhost:5001/api/quotes`
3. **Check frontend connects**: Open http://localhost:3000
4. **Check browser console**: Look for error messages
5. **Check terminal output**: Look for API errors

---

## ✅ Final Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] `.env.local` has correct API_BASE_URL
- [ ] Can upload test file without errors
- [ ] Quote appears in database
- [ ] Can view quotation details
- [ ] Can see history of quotes

---

**Now your frontend is correctly matched to your backend structure!**

Ready to test? Start both servers and visit http://localhost:3000 🎉

---

**Version**: 2.0 (CORRECTED for /api/quotes)  
**Backend Compatibility**: quotes.routes.ts  
**Date**: December 18, 2025
