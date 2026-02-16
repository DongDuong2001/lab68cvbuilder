# LAB68DEV CV Builder

A brutalist SaaS resume builder application built with Next.js 15, featuring passwordless authentication and multiple export templates.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Database**: Neon (Serverless Postgres)
- **ORM**: Drizzle ORM 0.45.1
- **Authentication**: Auth.js v5 (passwordless magic link via Resend)
- **Styling**: Tailwind CSS 4 (brutalist design system)
- **State Management**: Zustand 5.0.11
- **PDF Export**: @react-pdf/renderer 4.3.2
- **Email**: Resend 6.9.2

## Features

✅ Passwordless authentication with magic links  
✅ Dashboard with bento grid layout  
✅ Split-view resume builder (form + live preview)  
✅ Auto-save with 2-second debounce  
✅ Two brutalist templates (Lab Protocol, The Executive)  
✅ PDF export matching preview templates  
✅ Row-level security (RLS) via Server Actions  
✅ Mobile-responsive with preview toggle  

## Getting Started

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Neon Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Auth.js
AUTH_SECRET="your-secret-here"  # Generate with: npx auth secret
AUTH_URL="http://localhost:3000"

# Resend (for magic links)
AUTH_RESEND_KEY="re_xxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

**Get your Resend API key**: [https://resend.com/api-keys](https://resend.com/api-keys)

### 2. Database Setup

Push the Drizzle schema to your Neon database:

```bash
npm run db:push
```

This creates the following tables:
- `users` - User accounts
- `accounts` - OAuth/email provider links
- `sessions` - Session tokens
- `verification_tokens` - Magic link tokens
- `resumes` - Resume data (JSONB storage)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Scripts

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Drop all tables (DANGER!)
npm run db:drop
```

## Project Structure

```
src/
├── actions/
│   └── resume.ts               # Server Actions with RLS
├── app/
│   ├── api/
│   │   └── export/[id]/        # PDF export endpoint
│   ├── builder/[id]/           # Resume builder route
│   ├── dashboard/              # User dashboard
│   ├── login/                  # Auth pages (login, verify, error)
│   ├── globals.css             # Brutalist design system
│   └── layout.tsx              # Root layout
├── components/
│   ├── builder/
│   │   ├── forms/              # PersonalInfo, Experience, Education, Skills, Projects
│   │   ├── templates/          # Lab Protocol, Executive preview templates
│   │   ├── builder-client.tsx # Auto-save + split-view logic
│   │   ├── builder-form.tsx   # Tabbed form navigation
│   │   ├── builder-header.tsx # Title, template selector, export button
│   │   └── builder-preview.tsx # 8.5" × 11" paper preview
│   ├── dashboard/              # CreateResumeButton, ResumeCard
│   └── pdf/                    # Lab Protocol PDF, Executive PDF
├── db/
│   ├── index.ts                # Drizzle + Neon client
│   └── schema.ts               # Database schema + types
├── hooks/
│   └── use-debounce.ts         # Auto-save debounce (2s delay)
├── lib/
│   └── constants.ts            # EMPTY_RESUME_DATA, TEMPLATES
├── store/
│   └── resume-store.ts         # Zustand state management
├── types/
│   └── next-auth.d.ts          # Session type augmentation
├── auth.ts                     # Auth.js v5 configuration
└── middleware.ts               # Route protection
```

## Design Philosophy

This application follows a **brutalist design aesthetic**:

- **Zero border radius** (square corners everywhere)
- **Monochrome palette** (black & white only)
- **Inverted focus states** (black background, white text)
- **Visible borders** (1px black borders on all interactive elements)
- **Monospace labels** (uppercase, tracking-wider)
- **Grid overlays** (on landing page)
- **Industrial typography** (Archivo font family)

The design intentionally feels "raw" and "anti-AI" — no smooth gradients, no rounded corners, no subtle shadows. Just pure function.

## Authentication Flow

1. User enters email on `/login`
2. Magic link sent via Resend
3. User clicks link in email
4. Redirected to `/login/verify` (confirmation page)
5. Auth.js validates token and creates session
6. Redirected to `/dashboard`

## Resume Builder Features

### Form Sections

- **Personal Info**: Name, email, phone, location, website, LinkedIn, GitHub, summary
- **Experience**: Company, position, dates, location, description, highlights
- **Education**: Institution, degree, field, GPA, dates
- **Skills**: Categories with comma-separated items
- **Projects**: Name, URL, description, technologies, highlights

### Auto-Save

- Debounced with 2-second delay
- Saves on every field change
- Shows save status in header ("SAVING..." / "SAVED HH:MM:SS")
- Uses Zustand dirty tracking to prevent unnecessary saves

### Templates

**Lab Protocol** (brutalist sidebar template)
- Black 2.5" sidebar with white text
- Contact, links, skills, education on sidebar
- Experience & projects in main content
- Monospace section labels

**The Executive** (traditional top-down template)
- Large header with all contact info
- Professional summary at top
- Traditional section order
- Bold section headers with uppercase tracking

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."  # Generate new secret for production
AUTH_URL="https://yourdomain.com"
AUTH_RESEND_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

## Troubleshooting

### "JWTSessionError: no matching decryption secret"

**Fix**: Middleware is running on public routes. Check `src/middleware.ts` matcher config only includes protected routes (`/dashboard/*`, `/api/resumes/*`, `/api/export/*`).

### Magic link not sending

**Fix**: 
1. Verify `AUTH_RESEND_KEY` is set correctly
2. Check `EMAIL_FROM` is a verified domain in Resend
3. Check Resend dashboard for email logs

### Database connection errors

**Fix**:
1. Verify `DATABASE_URL` is correct
2. Check Neon dashboard for connection string
3. Ensure `?sslmode=require` is in the connection string
4. Run `npm run db:push` to create tables

### PDF export not working

**Fix**:
1. Check browser console for errors
2. Verify `/api/export/[id]` route is protected by middleware
3. Check resume data is properly saved before exporting

## License

MIT

## Credits

Built with brutalist design principles by lab68dev.
