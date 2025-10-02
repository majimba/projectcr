# 🔧 Project CR Dashboard - Technical Documentation

**Last Updated:** January 2025  
**Version:** 1.0.0  

---

## 🏗️ **Architecture Overview**

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js 15)  │◄──►│   (API Routes)  │◄──►│   (Supabase)    │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Next.js API   │    │ • PostgreSQL    │
│ • TypeScript    │    │ • Middleware    │    │ • Auth          │
│ • Tailwind CSS  │    │ • RLS Security  │    │ • Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🗄️ **Database Schema**

### **Tables and Relationships**

#### **profiles** (User Management)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **deliverables** (Task Management)
```sql
CREATE TABLE deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not-started' 
    CHECK (status IN ('not-started', 'to-do', 'in-progress', 'in-review', 'done')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assignee_name TEXT, -- Denormalized for easier queries
  project_area TEXT NOT NULL,
  due_date DATE,
  week_number INTEGER,
  document_link TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);
```

#### **project_phases** (Project Timeline)
```sql
CREATE TABLE project_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  start_date DATE,
  due_date DATE,
  status TEXT DEFAULT 'not-started' 
    CHECK (status IN ('not-started', 'in-progress', 'completed')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **team_members** (Team Management)
```sql
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  assigned_tasks TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **deliverable_comments** (Task Comments)
```sql
CREATE TABLE deliverable_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **deliverable_history** (Audit Trail)
```sql
CREATE TABLE deliverable_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔌 **API Endpoints**

### **Authentication Endpoints**
```typescript
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/user
```

### **Deliverables Endpoints**
```typescript
GET    /api/deliverables          // Fetch all deliverables
POST   /api/deliverables          // Create new deliverable
GET    /api/deliverables/[id]     // Get specific deliverable
PUT    /api/deliverables/[id]     // Update deliverable
DELETE /api/deliverables/[id]     // Delete deliverable
```

### **Project Management Endpoints**
```typescript
GET /api/project-phases           // Fetch project phases
GET /api/team-members            // Fetch team members
```

---

## 🎨 **Frontend Architecture**

### **Page Structure**
```
app/
├── layout.tsx                    // Root layout with providers
├── page.tsx                      // Dashboard (home)
├── login/page.tsx               // Authentication
├── deliverables/page.tsx        // Task management
├── timeline/page.tsx            // Project timeline
├── team/page.tsx                // Team management
├── reports/page.tsx             // Analytics
├── settings/page.tsx            // User settings
├── profile/page.tsx             // User profile
└── task/
    ├── create/page.tsx          // Create task
    └── [id]/page.tsx            // Task details
```

### **Component Structure**
```
components/
├── layout/
│   ├── Sidebar.tsx              // Navigation sidebar
│   └── TopBar.tsx               // Top navigation bar
├── ui/                          // Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── StatusBadge.tsx
│   ├── ProgressBar.tsx
│   ├── KpiCard.tsx
│   └── Toggle.tsx
└── charts/                      // Chart components
```

---

## 🔐 **Security Implementation**

### **Row Level Security (RLS) Policies**

#### **Profiles Table**
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### **Deliverables Table**
```sql
-- Users can view all deliverables
CREATE POLICY "Users can view all deliverables" ON deliverables
  FOR SELECT USING (true);

-- Users can create deliverables
CREATE POLICY "Users can insert deliverables" ON deliverables
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

### **Middleware Protection**
```typescript
// middleware.ts
const protectedRoutes = ['/', '/deliverables', '/timeline', '/team', '/reports', '/settings', '/profile', '/task'];

if (isProtectedRoute && !user && !isLoginPage) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

---

## 🎯 **TypeScript Types**

### **Core Types**
```typescript
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  role: string;
}

interface Deliverable {
  id: string;
  title: string;
  description: string | null;
  status: 'not-started' | 'to-do' | 'in-progress' | 'in-review' | 'done';
  assignee_id: string | null;
  assignee_name: string | null;
  project_area: string;
  due_date: string | null;
  week_number: number | null;
  document_link: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}
```

---

## 📧 **Email Notification System**

### **System Overview**
The email notification system provides automated email notifications for task assignments and completions, sending notifications to both team members and company management.

### **Architecture**
```
Task Assignment/Completion
├── Gmail SMTP Service
├── Team Member Email (Personal Gmail)
└── Company Email (hello@luminaryco.co)
```

### **Email Service Configuration**
- **Provider:** Gmail SMTP via Google Workspace
- **Authentication:** Gmail App Password
- **Sender:** hello@luminaryco.co
- **Templates:** Professional HTML email templates

### **Email Templates**

#### **Task Assignment (Team Member)**
- **Design:** Blue gradient header
- **Content:** Task details, due date, project area, progress
- **Action:** Direct link to task details page
- **Recipients:** Individual team member Gmail addresses

#### **Company Task Assignment Alert**
- **Design:** Orange/amber gradient header
- **Content:** Management-focused task overview
- **Action:** Resource allocation reminders
- **Recipients:** hello@luminaryco.co

#### **Task Completion Congratulations**
- **Design:** Green gradient header
- **Content:** Achievement celebration
- **Action:** Encouragement and recognition
- **Recipients:** Individual team member Gmail addresses

#### **Task Completion Notification**
- **Design:** Purple gradient header
- **Content:** Project update for management
- **Action:** Dashboard link for overview
- **Recipients:** hello@luminaryco.co

### **Team Member Email Mappings**
```typescript
const emailMap = {
  'Chawana Masaka': 'chawana.maseka@gmail.com',
  'Maynard Muchangwe': 'maynarjfilms@gmail.com',
  'Emmanuel Kapili': 'risendream@gmail.com',
  'Munsanje Hachamba': 'pandazm76@gmail.com',
  'Delphine Mwape': 'delphinemwape2@gmail.com'
};
```

### **API Endpoints**
- **POST /api/email/send** - Send email notifications
  - **Types:** assignment, congratulations, completion
  - **Payload:** { type, taskData, assigneeName }
  - **Response:** { success, data: { messageId } }

### **Email Environment Variables**
```env
GMAIL_USER=hello@luminaryco.co
GMAIL_APP_PASSWORD=your-gmail-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Error Handling**
- **Invalid Email:** Graceful fallback for missing team member emails
- **SMTP Errors:** Comprehensive error logging and user feedback
- **Template Errors:** Fallback to basic text emails
- **Network Issues:** Retry mechanism for failed deliveries

---

## 🚀 **Deployment Configuration**

### **Environment Variables**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration
GMAIL_USER=hello@luminaryco.co
GMAIL_APP_PASSWORD=your-gmail-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Company Configuration
COMPANY_EMAIL=hello@luminaryco.co
COMPANY_NAME=Luminary Co
PROJECT_NAME=Project CR
```

### **Vercel Configuration**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

---

## 📊 **Performance Optimizations**

### **Frontend Optimizations**
- **Code Splitting:** Automatic route-based splitting
- **Image Optimization:** Next.js Image component
- **Bundle Analysis:** Webpack bundle analyzer
- **Lazy Loading:** Dynamic imports for heavy components

### **Backend Optimizations**
- **Database Indexing:** Optimized queries with proper indexes
- **Connection Pooling:** Supabase connection management
- **Caching:** API response caching where appropriate
- **Query Optimization:** Efficient database queries

---

## 🧪 **Testing Strategy**

### **Frontend Testing**
- **Unit Tests:** Component testing with Jest
- **Integration Tests:** API integration testing
- **E2E Tests:** User flow testing with Playwright
- **Visual Regression:** UI component testing

### **Backend Testing**
- **API Testing:** Endpoint testing with Jest
- **Database Testing:** Schema and query testing
- **Security Testing:** RLS policy validation
- **Performance Testing:** Load testing with k6

---

## 📈 **Monitoring & Analytics**

### **Application Monitoring**
- **Error Tracking:** Sentry integration
- **Performance Monitoring:** Vercel Analytics
- **User Analytics:** Privacy-compliant tracking
- **Database Monitoring:** Supabase dashboard

### **Logging Strategy**
- **Structured Logging:** JSON format logs
- **Log Levels:** Error, Warning, Info, Debug
- **Log Aggregation:** Centralized logging system
- **Alerting:** Automated error notifications

---

## 🔄 **Development Workflow**

### **Git Workflow**
- **Main Branch:** Production-ready code
- **Feature Branches:** New feature development
- **Pull Requests:** Code review process
- **Automated Testing:** CI/CD pipeline

### **Code Quality**
- **ESLint:** Code linting and formatting
- **Prettier:** Code formatting
- **TypeScript:** Type checking
- **Husky:** Git hooks for quality checks

---

*This technical documentation provides detailed information about the system architecture, implementation, and deployment. For project management information, see the Project Management journal.*

