# CareLoop AI

**Created & Developed by [Mubashir Ali](https://www.medclinicx.com/) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)**

> **AI-powered patient follow-up automation that keeps care connected beyond the clinic visit.**

CareLoop AI is an **AI Patient Continuity & Care Engagement Platform** built to prevent clinics from losing patient engagement after the appointment ends. Unlike simple notification reminders, CareLoop AI analyzes care plans, tracks symptoms in natural language, evaluates recovery sentiments, monitors long-term chronic care metrics, and automatically escalates critical alerts to clinic staff.

---

## 🌟 Key Platform Features

### 1. AI Care Journey Engine
- **Visual Builder**: Design multi-stage outreach timelines starting from an EHR event checkout trigger.
- **Node Steps**: Incorporate wait delays, outbound check-ins, AI sentiment condition nodes, and clinic task alerts.
- **Dynamic Progression**: Journeys adapt automatically based on the patient's text updates.

### 2. AI Sentiment Triage & Alarm Pipeline
- **NLP Analysis**: Triages incoming patient text into `Positive`, `Neutral`, `Negative`, or `Alert` severity scales.
- **Symptom Flags**: Detects danger signs like bleeding, excessive swelling, or fever, immediately raising patient risk scores and spawning high-priority coordinator tasks.

### 3. Patient Continuity Profile
- **Circular Compliance Gauge**: Displays circular progress indicators tracking patient survey response rates.
- **Memory Logs**: Keeps notes of clinician preferences (e.g. *"anxious about stitches; prefers morning updates"*).
- **Outreach Channels**: Dynamically adapts check-in details for SMS, Email, or Portal settings.

### 4. Chronic Care Management
- **Disease Management Programs**: Fully seeded programs for **Diabetes (Glucose tracking)** and **Hypertension (Blood Pressure logs)**.
- **Vitals Analytics**: Real-time trend visualizers powered by Recharts (Area & Line charts with target ranges).
- **Patient Enrollment Flow**: Enroll patients in specialized programs from their profile details.

### 5. Multi-Tenant White-Label Branding
- **Dynamic Theming**: Clinicians can swap the branding stylesheet instantly:
  - **CareLoop Dental** (Teal / Emerald accent)
  - **Summit Surgical** (Indigo / Purple accent)
  - **HealthFlow Primary** (Sky / Blue accent)
- Accents automatically apply to focus indicators, gauges, buttons, charts, and notifications.

### 6. Smartphone Patient Simulator
- **Interactive Portal**: Accessible simulator mock rendering a patient's iPhone screen.
- **Voice Transcription**: Bouncing wave visualizer that records simulated voice inputs and transcribes them.
- **Intelligent FAQs**: Context-aware answers to showering, workouts, and post-op diet questions.

### 7. Enterprise HIPAA Compliance
- **Secure Audit Trails**: Traceability records documenting logged logins, task archives, care plan creations, and manual inbox overrides.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Database**: SQLite (ORM powered by Prisma)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🗄️ Database Architecture

- **Patient**: Holds compliance scores, risk reasons, preferences, and clinical timeline connections.
- **AuditLog**: Retains HIPAA compliance details linked to clinician actions.
- **ChronicProgram**: Defines target vital ranges (systolic/diastolic, glucose) and frequencies.
- **ChronicEnrollment**: Associates patients with disease programs and tracks individual compliance.
- **VitalReading**: Logs chronological patient metrics (GLUCOSE, SYSTOLIC_BP, DIASTOLIC_BP) with AI condition flags.

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js (v18.x or above recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seeding
Prisma will compile models, migrate SQLite files, and seed default clinic data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build Production Bundle
To compile and test static pages optimized for server execution:
```bash
npm run build
```

---

## 📱 Responsive Layout Guidelines

CareLoop AI implements a responsive breakpoint system ensuring compatibility across:
- **Mobile devices (320px - 480px)**: Collapsed drawer navigation sidebar, stacked stats, horizontal scrolling tabs/timelines, and scaled smartphone mockup layouts.
- **Tablets (481px - 1024px)**: Split-screen column grids (e.g. Inbox thread lists on left, chats on right) to maximize horizontal viewport workspace.
- **Laptops & Desktops (1025px+)**: Sleek, spacious panels with fixed sidebars and full multi-column dashboard sections.

---

## 👤 Developer & Creator

### 👋 Hi, I'm Mubashir Ali
**Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder**

I design and develop modern healthcare platforms focused on improving patient experiences, optimizing clinical workflows, and enabling healthcare organizations to deliver better digital care.

My work combines full-stack engineering, cloud infrastructure, AI automation, and healthcare technology standards to build scalable applications.

### 🚀 What I Build & Focus On
- 🏥 **Patient Portals & Telehealth Platforms** – Secure, seamless virtual care and clinical interactions.
- 💼 **Healthcare SaaS Products & Practice Management** – Optimizing medical practice operations and billing workflows.
- 🔄 **EHR Integration Systems & FHIR APIs** – Bridging clinical databases with modern cloud systems under HIPAA standards.
- 🤖 **Clinical Workflow Automation & AI Assistants** – Reducing administrative load with intelligent routing and automated patient recalls.

### 🛠️ Technical Expertise
- **Frontend & UI/UX**: React | Next.js | TypeScript | Tailwind CSS | Framer Motion | Vite
  - Component-based architectures, server-side rendering (SSR/ISR), high-performance interactive healthcare dashboards, and responsive clinical workflows.
- **Backend & API Architecture**: Node.js | PostgreSQL | Prisma | GraphQL
  - API architecture design, database schema modeling, robust authentication & RBAC, healthcare workflow engines, and scalable SaaS backends.
- **Cloud & DevOps Infrastructure**: AWS | Google Cloud | Vercel | Cloudflare | Docker
  - Multi-cloud deployments (AWS S3/EC2, GCP), application scaling, Cloudflare CDN optimizations, and containerized Docker environments with CI/CD automation.
- **Healthcare Standards & Integrations**:
  - FHIR APIs (Fast Healthcare Interoperability Resources)
  - EHR integrations & medical data workflows
  - HIPAA-focused application architecture & secure data transit

### 🌟 Featured Healthcare Projects
- 🩺 **PatientIQ | EHR Sync & Imaging Platform**
  - A unified healthcare portal designed to help patients securely access medical information, manage healthcare interactions, and stay connected with providers.
  - *Stack*: Next.js | TypeScript | Tailwind CSS | Prisma ORM | PostgreSQL
  - *Links*: Live Demo | GitHub
- 🦷 **Smile OS | Dental & Aesthetic Practice Management**
  - A modern clinical platform designed for dental clinics and aesthetic healthcare providers to streamline patient intake and tracking.
  - *Stack*: React | Vite | Vanilla CSS
  - *Links*: Live Demo | GitHub
- 🤖 **CareDesk | AI Clinical Workflow & Automation**
  - An automation and AI platform designed to reduce clinic administrative tasks and improve communication efficiency.
  - *Stack*: React | WebRTC | Clinical LLMs | AI Automation
  - *Links*: Live Demo | GitHub
- 📞 **TeleCare | Telehealth & Remote Care**
  - A virtual healthcare platform connecting patients and medical providers through secure, high-fidelity digital consultations.
  - *Stack*: Next.js | Tailwind CSS | WebRTC
  - *Links*: Live Demo | GitHub
- 🏥 **Clinic OS | Healthcare Practice Management**
  - An all-in-one centralized practice management platform built to orchestrate day-to-day operations.
  - *Stack*: Next.js | Tailwind CSS | Prisma ORM | PostgreSQL
  - *Links*: Live Demo | GitHub
- 🌿 **Aura Care | Mental Health & Wellness**
  - A patient-centered wellness platform designed to enhance mental healthcare accessibility and engagement.
  - *Stack*: React | Vite | Vanilla CSS
  - *Links*: Live Demo | GitHub

### 🧠 Engineering Approach
- **Scalability & Performance First** – Writing optimized, decoupled frontend/backend services.
- **Security-Centric** – Prioritizing patient data confidentiality and compliant architecture patterns.
- **User-Driven Design** – Developing intuitive interfaces centered around complex clinical and patient workflows.
- **Smarter Workflows** – Bridging clinical operations with automated systems and AI agents.

### 📫 Connect with Me
- 💼 **LinkedIn**: [mubashirali822](https://linkedin.com/in/mubashirali822)
- 📧 **Email**: alimubashir822@gmail.com
- 🌐 **Website**: [medclinicx.com](https://www.medclinicx.com/)

⭐ *Building the next generation of digital healthcare technology.*
