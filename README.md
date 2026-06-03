# 🚀 Full-Stack Developer Portfolio

A modern, fully dynamic portfolio platform built with **Next.js**, **TypeScript**, **Supabase**, and **Tailwind CSS**.

Designed to be **CMS-driven**, **scalable**, **secure**, **SEO-optimized**, and **production-ready**, this project allows all portfolio content to be managed through a protected admin dashboard without modifying the codebase.

---

## ✨ Features

### 🌐 Public Portfolio Website

#### 🏠 Home Page

- Hero section
- Professional introduction
- Call-to-action buttons
- Social media links
- Dark / Light mode toggle

#### 👨‍💻 About Section

- Personal background
- Professional experience
- Career journey

#### 🛠 Skills Section

- Frontend technologies
- Backend technologies
- Development tools
- Categorized skill management

#### 📂 Projects Showcase

- Featured projects
- GitHub repository links
- Live demo links
- Project thumbnails
- Technology relationships

#### 📄 Resume Management

- Dynamic resume upload
- Stored in Supabase Storage
- Public downloadable PDF
- Permanent URL strategy

#### ⭐ Testimonials

- Client/user testimonials
- 1–5 star ratings
- Approval workflow

#### 📬 Contact System

- Secure contact form
- Zod validation
- Disposable email detection
- Rate limiting
- Server-side processing
- Email notifications via Resend

---

# 🔐 Admin Dashboard

Protected dashboard powered by **Supabase Auth**.

## Authentication

- Email/password authentication
- Single-admin architecture
- Protected routes
- No public registration

---

## Dashboard Features

### 📂 Projects Management

- Create projects
- Edit projects
- Delete projects
- Upload project images
- Featured project toggles

### 🛠 Skills Management

- Create skills
- Edit skills
- Delete skills
- Assign categories
- Manage display order

### ⭐ Testimonials Management

- Approve testimonials
- Reject testimonials
- Delete testimonials

### 📩 Messages Management

- View contact submissions
- Mark messages as read
- Remove spam messages

### 📄 Resume Management

- Upload resume
- Replace existing resume
- Maintain permanent public URL

### 🎨 Portfolio Content Management

- Update hero section
- Edit about content
- Manage social links

### 📊 Analytics Dashboard

- Total projects
- Total messages
- Unread messages
- Pending testimonials
- Recent activity overview

---

# ⚙️ Tech Stack

| Category         | Technology       |
| ---------------- | ---------------- |
| Frontend         | Next.js          |
| Language         | TypeScript       |
| Styling          | Tailwind CSS     |
| UI Components    | shadcn/ui        |
| Icons            | Lucide React     |
| Theme Management | next-themes      |
| Backend          | Supabase         |
| Authentication   | Supabase Auth    |
| Database         | PostgreSQL       |
| Storage          | Supabase Storage |
| Email Service    | Resend           |
| Validation       | Zod              |
| Hosting          | Vercel           |

---

# 🗄 Database Architecture

Powered by **PostgreSQL** through Supabase with full **Row Level Security (RLS)**.

## Core Tables

```text
projects
skills
project_skills
testimonials
messages
settings
admins
```

## Database Features

- Many-to-many project ↔ skills relationship
- Automatic `updated_at` triggers
- Secure admin whitelist system
- Singleton settings table
- Performance indexes
- Full RLS protection

---

# 🛡 Security Features

## Row Level Security (RLS)

- Public users can only access approved content
- Admin-only write permissions
- Write-only contact submissions
- Protected dashboard access

## Additional Security Measures

- Zod validation
- Disposable email filtering
- API rate limiting
- Secure server-side actions
- Environment variable protection
- Secure storage bucket policies

---

# 🔍 SEO Features

- Next.js Metadata API
- Dynamic metadata generation
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Dynamic sitemap.xml
- robots.txt
- Structured Data (JSON-LD)

---

# 📦 Storage Architecture

## Supabase Storage Buckets

### 📁 project-images

Public bucket for project thumbnails and screenshots.

### 📁 testimonial-images

Public bucket for testimonial profile images.

### 📁 resume

Public bucket for resume storage.

#### Recommended Structure

```text
resume/resume.pdf
```

This ensures the public URL remains unchanged when replacing the resume file.

---

# 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone "https://github.com/bossRaf/raff-personal-web"
cd project-folder
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

---

# 🏗 Supabase Setup

## Required Steps

1. Create a Supabase project
2. Execute the database schema
3. Configure storage buckets
4. Configure RLS policies
5. Create the admin account
6. Insert admin UUID into the admins table

### Example Admin Injection

```sql
INSERT INTO admins (user_id)
VALUES ('your-user-uuid');
```

---

# 🚢 Deployment

Optimized for deployment on **Vercel**.

## Deployment Features

- Automatic deployments
- GitHub integration
- Global CDN
- Environment variable management
- Optimized Next.js hosting

---

# 🎨 UI & Design System

Built with:

- shadcn/ui
- Tailwind CSS
- Lucide React

## Design Goals

- Modern interface
- Clean layouts
- Accessibility-first
- Smooth animations
- Responsive design
- Dark/Light mode support

---

# 📈 Recommended Development Order

```text
1. Supabase Setup
2. Storage Configuration
3. Next.js Initialization
4. Tailwind CSS + shadcn/ui Setup
5. Supabase Client Setup
6. Authentication Middleware
7. Public Portfolio Pages
8. Admin Dashboard
9. CRUD Operations
10. Contact System
11. Resend Integration
12. SEO Optimization
13. Deployment
```

---

# 🎯 Final Outcome

This project is designed to be:

✅ Fully Dynamic
✅ CMS-Driven
✅ Production Ready
✅ Scalable
✅ Secure
✅ SEO Optimized
✅ Responsive
✅ Professional Grade
✅ Easy to Maintain

---

# 📜 License

This project is intended for **personal portfolio**, **learning**, and **educational purposes**.

---

<div align="center">

### Built with ❤️ using Next.js, Supabase & TypeScript

</div>
