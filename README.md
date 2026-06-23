# 🔧 AppForge

**Transform JSON schemas into fully functional web applications in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Overview

**AppForge** is a high-performance, metadata-driven JSON-to-App generator platform. Define your application's entities, fields, and pages in a single JSON schema, and instantly deploy a secure, functional web application with CRUD tables, workflows, dynamic forms, and a neobrutalist design theme.

Perfect for building internal tooling, database administration panels, quick prototypes, and custom MVPs with zero backend code.

---

## ✨ Features

### 🌟 Core Capabilities
- **Dynamic CRUD UI Engine**: Auto-generates fully functional forms and data tables based on schema fields.
- **Support for 6 Primitive Field Types**: `string`, `text`, `number`, `boolean`, `date`, and `enum`.
- **Inline Editing (PATCH)**: Complete record update flow using neobrutalist form modals.
- **Pagination & Search Filtering**: High-performance client-side search query logic and table page segmentation.
- **Workflow Automation Engine**: Configure conditional triggers (`app.created`, `record.created`, `record.deleted`) to run webhooks, write console logs, or dispatch toast alerts.

### 🛡️ Production Security & Auth
- **Multi-Authentication System**: Leverages **NextAuth v5** supporting GitHub OAuth and email/password credentials credentials.
- **App Ownership Isolation**: Automatically links applications to creator user IDs so configurations and data remain secure and isolated.
- **Edge Compatibility**: Optimized configuration using Edge runtime middleware for rapid route checking.

### 📥 CSV Import Utility
- **Bulk Upload**: Import multiple records from local `.csv` files in a single transaction.
- **Custom Column Mapping**: Dynamic interface to match CSV headers to schema fields, with automatic validation and type coercion.

### 🎨 Visual & Polish
- **Neobrutalist Theme**: Cyberpunk brutalist design system (yellow/black borders, flat offset shadows, marquee tickers, and responsive grids).
- **Framer Motion Animations**: Micro-animations and staggered transitions.
- **Toast Notification Center**: Built-in popup and persistent in-app notifications with read status management.

---

## 🏗️ Architecture

```
track-a/
├── prisma/
│   └── schema.prisma          # Database models (User, Account, Session, AppConfig, Record, Workflow, Notification)
├── src/
│   ├── app/
│   │   ├── [appId]/           # Dynamic app runtime UI
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth API endpoints
│   │   │   ├── notifications/ # Notification center controller
│   │   │   ├── runtime/       # Dynamic CRUD & bulk CSV REST routes
│   │   │   └── workflows/     # Workflow management endpoints
│   │   ├── dashboard/         # User applications command center
│   │   ├── editor/            # Dynamic JSON configuration editor
│   │   └── workflows/[appId]/ # Workflow dashboard UI
│   ├── components/
│   │   ├── auth/              # Auth forms and user headers
│   │   ├── landing/           # Homepage hero and quick templates
│   │   ├── notifications/     # Bell panel and toast toast provider
│   │   └── renderer/          # Form, Table, and Error boundary renderers
│   ├── lib/
│   │   ├── prisma.ts          # Singleton database client wrapper
│   │   ├── workflow-engine.ts # Backend trigger-action condition parser
│   │   └── config-validator.ts # JSON schema integrity checker
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- A [Neon PostgreSQL](https://neon.tech) account (or any database URL)

### Setup

```bash
# Clone the repository
git clone https://github.com/mithileshofficial06/intern-demo.git
cd intern-demo

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Edit the `.env` file with your connection strings:
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-key"
GITHUB_CLIENT_ID="your-github-id"
GITHUB_CLIENT_SECRET="your-github-secret"
```

### Database Deployment & Server Launch
```bash
# Generate Prisma Client classes
npx prisma generate

# Apply schemas to the Neon PostgreSQL database
npx prisma db push

# Launch the development server
npm run dev
```

Visit `http://localhost:3000` to begin.

---

## 🔌 Core API Documentation

### Create App Configuration
`POST /api/runtime/register`
```json
{
  "app": "Inventory Manager",
  "entities": [
    {
      "name": "Item",
      "fields": [
        { "name": "sku", "type": "string", "required": true },
        { "name": "quantity", "type": "number", "default": 0 }
      ]
    }
  ]
}
```

### List/Create Records
`GET` / `POST` `/api/runtime/{appId}/{entity}`
*   Query params for `GET`: `page` (number), `limit` (number), `search` (string)

### Bulk CSV Upload
`POST` `/api/runtime/{appId}/{entity}/bulk`
*   Body: JSON array of dynamic record objects.

### Edit Record
`PATCH` `/api/runtime/{appId}/{entity}?id={recordId}`
*   Body: Updated fields object.

---

## 🔮 Roadmap & Limitations

### Known Limits
- **No File Uploads**: Fields only hold primitives (text, dates, numbers, enums).
- **Flat Records**: Relational mapping (foreign keys) between different entities is not supported.

### Roadmap
- [ ] Relational field bindings (has-many, belongs-to support)
- [ ] Visual Drag-and-Drop Workflow Builder
- [ ] Dynamic Chart / Graph rendering pages
- [ ] PDF and Excel export reporting

---

## 📄 License
This project is licensed under the MIT License.
