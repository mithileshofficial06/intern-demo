# 🔧 AppForge

**Transform JSON configurations into fully functional web applications in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Overview

**AppForge** is a JSON-to-App generator platform that eliminates traditional development overhead. Define your data schema in JSON, and instantly get a production-ready application with:

- 🎨 **Dynamic UI** - Auto-generated forms and tables
- 🗄️ **Database Management** - Automatic PostgreSQL schema and CRUD operations
- ⚡ **Real-time Updates** - Live data synchronization
- 🎭 **Brutalist Design** - Bold, accessible, modern interface
- 🚀 **Zero Configuration** - Works out of the box

**Perfect for:** Rapid prototyping, internal tools, admin panels, MVPs, proof-of-concepts.

---

## ✨ Features

### Core Functionality
- ✅ **JSON-to-App Generation** - Convert schemas to working apps instantly
- ✅ **Dynamic CRUD Operations** - Create, read, and delete records automatically
- ✅ **6 Field Types** - string, text, number, boolean, date, enum
- ✅ **Form Validation** - Required fields, type checking, defaults
- ✅ **Table Rendering** - Sortable columns, formatted data display
- ✅ **RESTful API** - Auto-generated endpoints for every entity
- ✅ **Error Boundaries** - Graceful error handling and recovery
- ✅ **Responsive Design** - Mobile-friendly interface

### Technical Features
- 🔥 **Turbopack** - Lightning-fast builds (10x faster than Webpack)
- 🎭 **Server Components** - Optimal performance with React 19
- 🌐 **Edge Runtime** - Global low-latency API responses
- 🗃️ **Serverless Database** - Neon PostgreSQL with autoscaling
- 🎨 **Framer Motion** - Smooth animations and transitions
- 🔒 **Type Safety** - Full TypeScript coverage with Zod validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- [Neon](https://neon.tech) PostgreSQL account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/appforge.git
cd appforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Neon DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## 📖 Usage Guide

### 1. Create Your JSON Schema

Define your app structure with this format:

```json
{
  "app": "Task Manager",
  "entities": [
    {
      "name": "Task",
      "fields": [
        { "name": "title", "type": "string", "required": true },
        { "name": "status", "type": "enum", "values": ["todo", "in_progress", "done"] },
        { "name": "priority", "type": "number", "default": 1 },
        { "name": "dueDate", "type": "date" },
        { "name": "completed", "type": "boolean", "default": false },
        { "name": "description", "type": "text" }
      ]
    }
  ],
  "pages": [
    { "type": "list", "entity": "Task" },
    { "type": "form", "entity": "Task" }
  ]
}
```

### 2. Generate Your App

1. Paste your JSON into the editor on the homepage
2. Click **"Generate App"**
3. Get redirected to your working app at `/{appId}`

### 3. Use Your App

- **View Records** - See all entries in a dynamic table
- **Add New** - Fill form and submit to create records
- **Delete** - Remove records with one click
- **Navigate** - Switch between entities via sidebar

---

## 🎯 Field Types Reference

| Type | Description | Example | Validation |
|------|-------------|---------|------------|
| `string` | Single-line text input | `"John Doe"` | Max length configurable |
| `text` | Multi-line textarea | `"Long description..."` | Supports newlines |
| `number` | Numeric input | `42` | Integer or decimal |
| `boolean` | Checkbox | `true` / `false` | Binary state |
| `date` | Date picker | `"2026-06-22"` | ISO 8601 format |
| `enum` | Dropdown select | `["small", "medium", "large"]` | Predefined options |

**Field Properties:**
- `name` (required) - Field identifier (camelCase)
- `type` (required) - One of the types above
- `required` (optional) - `true` to enforce validation
- `default` (optional) - Default value for new records
- `values` (required for enum) - Array of allowed values

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 16.2.9 (App Router)
- React 19.0 (Canary)
- Tailwind CSS 4.0
- Framer Motion 11.18
- Radix UI (Accessible components)
- Lucide React (Icons)

**Backend**
- Next.js API Routes
- Prisma 7.8.0 (ORM)
- Neon PostgreSQL (Serverless)
- Zod (Validation)

**Developer Tools**
- TypeScript 5.7
- ESLint 9.18
- Turbopack (Bundler)

### Project Structure

```
track-a/
├── prisma/
│   └── schema.prisma          # Database models
├── src/
│   ├── app/
│   │   ├── [appId]/
│   │   │   └── page.tsx       # Dynamic app runtime
│   │   ├── api/
│   │   │   └── runtime/       # RESTful API endpoints
│   │   ├── page.tsx           # Homepage with JSON editor
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── landing/           # Homepage components
│   │   └── renderer/          # Dynamic app components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── config-validator.ts # JSON validation logic
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── config.ts          # TypeScript interfaces
├── public/                    # Static assets
├── .env                       # Environment variables
└── package.json               # Dependencies
```

### Database Schema

```prisma
model AppConfig {
  id        String   @id @default(cuid())
  appId     String   @unique
  name      String
  config    Json
  createdAt DateTime @default(now())
  records   Record[]
}

model Record {
  id        String    @id @default(cuid())
  appId     String
  entity    String
  data      Json
  createdAt DateTime  @default(now())
  app       AppConfig @relation(fields: [appId], references: [appId])
}
```

---

## 🔌 API Reference

### Register New App
```http
POST /api/runtime/register
Content-Type: application/json

{
  "app": "My App",
  "entities": [...],
  "pages": [...]
}

Response: 201 Created
{
  "appId": "abc123xyz",
  "name": "My App",
  "message": "App registered successfully"
}
```

### Get App Configuration
```http
GET /api/runtime/{appId}

Response: 200 OK
{
  "appId": "abc123xyz",
  "name": "My App",
  "config": { ... },
  "createdAt": "2026-06-22T10:00:00.000Z"
}
```

### List Records
```http
GET /api/runtime/{appId}/{entity}

Response: 200 OK
{
  "records": [
    {
      "id": "rec_123",
      "data": { ... },
      "createdAt": "2026-06-22T10:00:00.000Z"
    }
  ]
}
```

### Create Record
```http
POST /api/runtime/{appId}/{entity}
Content-Type: application/json

{ "field1": "value1", "field2": "value2" }

Response: 201 Created
{
  "id": "rec_new",
  "data": { ... },
  "createdAt": "2026-06-22T10:05:00.000Z"
}
```

### Delete Record
```http
DELETE /api/runtime/{appId}/{entity}?id={recordId}

Response: 200 OK
{ "message": "Record deleted" }
```

---

## 🎨 Design System

AppForge uses a **brutalist design philosophy**:

- **Typography:** Bold, high-contrast headings with tight letter spacing
- **Colors:** Minimal palette (black, white, purple-600, yellow, red)
- **Layout:** Asymmetric grids, thick borders, raw aesthetics
- **Animation:** Marquee tickers, glitch effects, staggered reveals
- **Accessibility:** ARIA labels, keyboard navigation, focus indicators

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
   ```
   DATABASE_URL="your-neon-connection-string"
   ```
4. Deploy automatically on every push

### Manual Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🧪 Example Configurations

### Game Library Tracker
```json
{
  "app": "Game Library",
  "entities": [{
    "name": "Game",
    "fields": [
      { "name": "title", "type": "string", "required": true },
      { "name": "platform", "type": "enum", "values": ["PC", "PS5", "Xbox", "Switch"] },
      { "name": "rating", "type": "number" },
      { "name": "completed", "type": "boolean", "default": false },
      { "name": "purchaseDate", "type": "date" },
      { "name": "notes", "type": "text" }
    ]
  }]
}
```

### Inventory Manager
```json
{
  "app": "Inventory System",
  "entities": [{
    "name": "Product",
    "fields": [
      { "name": "name", "type": "string", "required": true },
      { "name": "sku", "type": "string", "required": true },
      { "name": "quantity", "type": "number", "default": 0 },
      { "name": "category", "type": "enum", "values": ["electronics", "furniture", "supplies"] },
      { "name": "inStock", "type": "boolean", "default": true },
      { "name": "lastRestocked", "type": "date" }
    ]
  }]
}
```

### Event Planner
```json
{
  "app": "Event Tracker",
  "entities": [{
    "name": "Event",
    "fields": [
      { "name": "name", "type": "string", "required": true },
      { "name": "date", "type": "date", "required": true },
      { "name": "venue", "type": "string" },
      { "name": "attendees", "type": "number", "default": 0 },
      { "name": "status", "type": "enum", "values": ["planning", "confirmed", "completed", "cancelled"] },
      { "name": "notes", "type": "text" }
    ]
  }]
}
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication (optional - for future features)
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

**Get your Neon connection string:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste into `.env`

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Adding New Features

1. **New Field Type:**
   - Update `src/types/config.ts` with new type
   - Add rendering logic in `src/components/renderer/FormRenderer.tsx`
   - Update validation in `src/lib/config-validator.ts`

2. **New Page Type:**
   - Add type to config schema
   - Create component in `src/components/renderer/`
   - Update routing in `src/app/[appId]/page.tsx`

3. **New API Endpoint:**
   - Create route in `src/app/api/runtime/`
   - Add Prisma query logic
   - Update TypeScript types

---

## 🐛 Known Limitations

- ❌ **No Edit/Update:** Records can only be created and deleted (not updated)
- ❌ **No Pagination:** All records loaded at once
- ❌ **No Search:** Client-side filtering not implemented
- ❌ **No Authentication:** All apps publicly accessible
- ❌ **No File Uploads:** Only primitive field types supported
- ❌ **No Relationships:** No foreign keys between entities

---

## 🔮 Roadmap

### v1.1 (Q3 2026)
- [ ] Record editing (PUT/PATCH operations)
- [ ] Pagination and infinite scroll
- [ ] Search and filter UI
- [ ] User authentication (NextAuth)

### v1.2 (Q4 2026)
- [ ] Relational fields (foreign keys)
- [ ] File upload support
- [ ] Custom themes
- [ ] Export to CSV/JSON

### v2.0 (2027)
- [ ] Multi-tenancy
- [ ] Role-based access control
- [ ] AI-powered schema generation
- [ ] Visual schema builder
- [ ] Plugin system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style (ESLint rules)
- Add TypeScript types for all new code
- Test changes locally before submitting
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Radix UI](https://www.radix-ui.com/) - Accessible components

---

## 📞 Support

- **Documentation:** [Full project report](CLAUDE.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/appforge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/appforge/discussions)

---

**Made with 🔥 by [Mithi](https://github.com/mithi)**

*AppForge - Build apps from config, not from scratch.*
