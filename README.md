# Kapsomoita AGC Church Website & Management System

Official web platform for Kapsomoita African Gospel Church (AGC). The platform features a public-facing portal for visitors and congregation members, paired with an administrative management dashboard for church leadership and staff.

---

## Architecture Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query (React Query v5), React Router v7, Framer Motion, Lucide React, React Hook Form, Zod.
- **Backend**: Spring Boot 3, Java 21, Spring Security (Stateless JWT with token rotation), Spring Data JPA, PostgreSQL, Flyway Migrations, Cloudinary Media Integration.
- **Hosting**:
  - **Frontend**: Deployed on [Vercel](https://kapsomoita-church-website.vercel.app/) with automated build pipelines.
  - **Backend**: Containerized via Docker and deployed on [Render](https://kapsomoita-church-website.onrender.com/).
  - **Database**: Cloud PostgreSQL via Neon.

---

## System Features

### Public Portal
- **Landing Page**: Dynamic hero slideshow, weekly gatherings/service times, church bulletin notices, upcoming events with live countdowns, ministry highlights, pastor's welcome message, sermons preview, and photo gallery highlights.
- **Ministries Directory**: Dedicated pages for all church ministries (Men, Women, Youth, Children, Sunday School, Choir, Praise Team, Prayer, Evangelism, Missions, Media) with volunteer registration forms.
- **Teaching & Sermons**: Sermon video/audio streaming, downloadable study guides, series tagging, and view counts.
- **Media Gallery**: Tagged and categorized photo archives loaded directly from Cloudinary.
- **Giving & Stewardship**: Online giving guidelines and donation support.
- **Outreach & Communication**: Contact submission, prayer request requests, and newsletter signups.

### Administration Dashboard
- **Content Operations**: Manage homepage banners, service times, public notices, testimonials, and dynamic website imagery.
- **Events & Registration**: Manage calendar schedules, venues, seating capacities, and registration lists.
- **Sermon Management**: Publish messages with automated YouTube thumbnail scraping and media asset management.
- **People & Applications**: Review volunteer ministry applications, prayer requests, and contact messages.
- **Access Control & Security**: Role-based access control (RBAC) with `SUPER_ADMIN`, `ADMIN`, and `STAFF` tiers, alongside an immutable audit log.

---

## Directory Structure

```text
Kapsomoita-Church-Website/
├── backend/                        # Spring Boot Java application
│   ├── src/main/java/              # Domain entities, repositories, services, controllers
│   ├── src/main/resources/         # application.yml and Flyway SQL migrations (db/migration)
│   ├── Dockerfile                  # Production multi-stage Docker build
│   ├── docker-entrypoint.sh        # Port forwarding and JVM startup script
│   └── pom.xml                     # Maven project configuration
├── frontend/                       # React + TypeScript single-page application
│   ├── src/                        # Pages, reusable UI components, hooks, API clients
│   ├── public/                     # Static icons, fonts, and assets
│   ├── tailwind.config.js          # Styling rules and brand colour tokens
│   ├── vite.config.ts              # Vite bundling, manual chunking, and dev proxy
│   └── package.json                # Frontend dependencies and build scripts
├── vercel.json                     # Vercel deployment, SPA routes, and backend reverse proxy
└── README.md                       # Project documentation
```

---

## Local Development Setup

### Prerequisites
- Node.js 20+ and npm / pnpm
- Java Development Kit (JDK) 21+
- Apache Maven 3.9+
- PostgreSQL 15+ (local or cloud instance like Neon)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create an environment file `backend/.env` with your local or cloud configuration:
   ```env
   SERVER_PORT=8080
   DB_JDBC_URL=jdbc:postgresql://localhost:5432/kapsomoita_church
   DB_USERNAME=postgres
   DB_PASSWORD=your_password

   # JWT Secrets (minimum 64 characters)
   JWT_ISSUER=kapsomoita-church
   JWT_ACCESS_SECRET=your_super_secret_access_token_key_at_least_64_bytes_long_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_at_least_64_bytes_long_here
   JWT_ACCESS_TTL_SECONDS=900
   JWT_REFRESH_TTL_SECONDS=1209600

   # CORS
   APP_CORS_ALLOWED_ORIGINS=http://localhost:5173

   # Cloudinary Media
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Optional Super Admin Seeding
   ADMIN_BOOTSTRAP_EMAIL=admin@kapsomoita.org
   ADMIN_BOOTSTRAP_PASSWORD=SecurePassword123
   ADMIN_BOOTSTRAP_NAME=Super Admin
   ```

3. Run Flyway migrations and start the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will run on `http://localhost:8080`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configure your local environment in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GITHUB_PAGES=false
   VITE_CLOUDINARY_CLOUD_NAME=diutaj0s9
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The web application will open at `http://localhost:5173`.

---

## Production Deployment

### 1. Backend (Render)
- **Runtime**: Docker
- **Root Directory**: `backend`
- **Build / Runtime Command**: Automated via `backend/Dockerfile`
- **Environment Variables**: Add your production `DB_JDBC_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_*`, `CLOUDINARY_*`, and `APP_CORS_ALLOWED_ORIGINS`.

### 2. Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `./` (configured via `vercel.json`)
- **Build Command**: `cd frontend && npm run build:no-typecheck`
- **Output Directory**: `frontend/dist`
- **API Proxying**: `vercel.json` automatically proxies `/api/*` to the deployed backend on Render:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://kapsomoita-church-website.onrender.com/api/$1" },
      { "source": "/((?!api/).*)", "destination": "/index.html" }
    ]
  }
  ```

---

## Security & Authentication

- **Stateless Bearer Tokens**: Short-lived JWT access tokens (15 minutes) paired with persistent refresh tokens (14 days).
- **Refresh Token Rotation**: Each token refresh cycle revokes the previous token and issues a new pair to prevent token replay attacks.
- **Preflight & Origin Filtering**: CORS is configured in `SecurityConfig.java` using `setAllowedOriginPatterns` to safely authorize production domains, Vercel preview URLs, and local environments with credentials enabled.
- **Fail-Safe Client Handling**: Frontend TanStack queries include fallback content and defensive array type guards to ensure uninterrupted site operation during network transitions.

---

## License

All rights reserved. Property of Kapsomoita African Gospel Church.
