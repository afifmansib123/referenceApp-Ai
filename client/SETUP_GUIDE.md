# AI Manufacturing Quotation System - Frontend Setup Guide

## 📋 Overview

This guide will help you set up the **AI Project Frontend** from scratch. Follow these steps exactly, and you'll have a fully functional Next.js application integrated with your Express backend.

---

## Phase 1: Initial Project Creation

### Step 1.1: Create Next.js Project

```bash
cd /path/to/your/projects
npx create-next-app@latest ai-project-client --typescript --tailwind --app
```

**When prompted, select:**
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- App Router: **Yes**
- Default import alias: **Yes** (use `@/*`)

```bash
cd ai-project-client
```

### Step 1.2: Install Dependencies

```bash
npm install
```

---

## Phase 2: Install Required Packages

### Step 2.1: AWS Amplify & Authentication

```bash
npm install aws-amplify @aws-amplify/ui-react
```

### Step 2.2: Redux & RTK Query (State Management)

```bash
npm install @reduxjs/toolkit react-redux axios
```

### Step 2.3: Form Handling & Validation

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Step 2.4: UI Icons

```bash
npm install lucide-react
```

### Verify installation:

```bash
npm list | grep -E "aws-amplify|@reduxjs|react-redux|zod|lucide"
```

---

## Phase 3: Configure TypeScript

### Step 3.1: Update `tsconfig.json`

Replace your `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Phase 4: Configure Tailwind CSS

### Step 4.1: Update `tailwind.config.ts`

Replace with the provided `tailwind.config.ts` file (check downloads folder)

### Step 4.2: Update `globals.css`

Replace `src/globals.css` with the provided `globals.css` file

### Step 4.3: Verify PostCSS Config

Ensure `postcss.config.mjs` exists:

```bash
cat postcss.config.mjs
```

Should show:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Phase 5: Create Folder Structure

### Step 5.1: Create main source folders

```bash
mkdir -p src/{app,components,services,types,utils,contexts,hooks,lib,state}
```

### Step 5.2: Verify structure

```bash
tree -L 2 src/
```

Should show:
```
src/
├── app/
├── components/
├── contexts/
├── hooks/
├── lib/
├── services/
├── state/
├── types/
└── utils/
```

---

## Phase 6: Add Core Files

### Step 6.1: Create types

Create `src/types/index.ts` - use provided file

### Step 6.2: Create validation schemas

Create `src/lib/validations.ts` - use provided file

### Step 6.3: Create Redux API slice

Create `src/state/api.ts` - use provided file

### Step 6.4: Create Redux store

Create `src/state/store.ts` - use provided file

### Step 6.5: Create services

```bash
mkdir -p src/services
```

Create:
- `src/services/auth.service.ts` - use provided file
- `src/services/drawing.service.ts` - use provided file

### Step 6.6: Create utilities

Create `src/utils/helpers.ts` - use provided file

---

## Phase 7: Create Layout & Pages

### Step 7.1: Update root layout

Replace `src/app/layout.tsx` with provided file

### Step 7.2: Create dashboard page

```bash
touch src/app/page.tsx
```

Use provided `page.tsx` file

### Step 7.3: Create upload page

```bash
mkdir -p src/app/upload
touch src/app/upload/page.tsx
```

Use provided upload page file

### Step 7.4: Create quotation detail page

```bash
mkdir -p src/app/quotation/[id]
touch src/app/quotation/\[id\]/page.tsx
```

Use provided quotation detail file

### Step 7.5: Create history page

```bash
mkdir -p src/app/history
touch src/app/history/page.tsx
```

Use provided history page file

---

## Phase 8: Configure Environment Variables

### Step 8.1: Create `.env.local`

```bash
touch .env.local
```

### Step 8.2: Add variables

Copy `.env.local.example` content and fill in your actual values:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_COGNITO_DOMAIN=your_cognito_domain
NEXT_PUBLIC_AWS_REGION=ap-southeast-1

# AWS S3 Configuration
NEXT_PUBLIC_AWS_S3_BUCKET=your_bucket_name

# Application Configuration
NEXT_PUBLIC_APP_NAME=AI Manufacturing Quotation
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8.3: Add to `.gitignore`

Ensure `.env.local` is in `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

---

## Phase 9: Update Backend Configuration

### Step 9.1: Modify server-side for AWS

Update your Express backend:

1. **Install AWS SDK:**
   ```bash
   npm install aws-sdk sharp
   ```

2. **Update authentication middleware** - use provided auth middleware code

3. **Add S3 service** - use provided S3Service code

4. **Update .env** with AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=ap-southeast-1
   AWS_S3_BUCKET=your_bucket
   ```

---

## Phase 10: Start Development

### Step 10.1: Run frontend

```bash
npm run dev
```

Should show:
```
> Local:        http://localhost:3000
> Environments: .env.local
```

### Step 10.2: Run backend (in separate terminal)

```bash
cd ../ai-project-server
npm run dev
```

Should show backend running on port 5000

### Step 10.3: Test in browser

Open `http://localhost:3000` in your browser

---

## ✅ Verification Checklist

- [ ] Next.js project created with TypeScript
- [ ] All dependencies installed successfully
- [ ] Folder structure created as specified
- [ ] All core files added (types, services, state, pages)
- [ ] TailwindCSS configured and working
- [ ] Environment variables configured
- [ ] Backend updated with AWS config
- [ ] Frontend runs on localhost:3000
- [ ] Backend runs on localhost:5000
- [ ] Can upload drawing files
- [ ] Quotation page displays data

---

## 🐛 Troubleshooting

### Issue: "Module not found @reduxjs/toolkit"

**Solution:**
```bash
npm install --save-exact @reduxjs/toolkit@1.9.7 react-redux@8.1.3
```

### Issue: "Amplify configure error"

**Solution:**
- Verify all NEXT_PUBLIC_AWS_* env variables are set
- Check AWS Cognito pool ID and client ID
- Restart dev server: `npm run dev`

### Issue: "API calls returning 401"

**Solution:**
- Verify backend auth middleware is correct
- Check JWT token in Authorization header
- Ensure Cognito is properly configured

### Issue: "S3 upload failing"

**Solution:**
- Verify AWS credentials in backend `.env`
- Check S3 bucket exists and is accessible
- Ensure bucket policy allows public uploads

---

## 📦 File Checklist

After completing all phases, you should have:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── upload/
│   │   └── page.tsx
│   ├── quotation/
│   │   └── [id]/
│   │       └── page.tsx
│   └── history/
│       └── page.tsx
├── components/
├── contexts/
├── hooks/
├── lib/
│   └── validations.ts
├── services/
│   ├── auth.service.ts
│   └── drawing.service.ts
├── state/
│   ├── api.ts
│   └── store.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
└── globals.css

Config files:
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.mjs
├── .env.local
└── .env.local.example
```

---

## 🚀 Next Steps

1. **Customize styling** - Update colors in `tailwind.config.ts`
2. **Add more pages** - Create additional functionality pages
3. **Deploy to Vercel** - `npm install -g vercel && vercel`
4. **Connect to production backend** - Update API_BASE_URL
5. **Configure custom domain** - Set up DNS records

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Need help?** Check the troubleshooting section or review the source code in provided files.
