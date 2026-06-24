Created & Developed by [Mubashir Ali](#developer-creator) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)

# CareLoop AI

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

<a id="developer-creator"></a>
## 👤 Developer & Creator

I am a Full-Stack Healthcare Technology Developer specializing in building modern, scalable, and AI-powered healthcare platforms. I create high-performance digital solutions using React.js, Next.js, TypeScript, and Tailwind CSS to deliver fast, secure, and user-friendly experiences.

My expertise covers complete application development, from frontend architecture and responsive interfaces to backend systems powered by Node.js, REST APIs, GraphQL, PostgreSQL, and Prisma ORM. I build reliable platforms designed for scalability, performance, and long-term growth.

I work with modern cloud infrastructure including AWS, Vercel Edge, Google Cloud, Cloudflare CDN, Docker, and CI/CD pipelines to deploy secure and optimized applications.

With a strong focus on healthcare technology, I develop solutions including patient portals, AI automation systems, EHR integrations, and healthcare applications built around industry standards such as FHIR APIs and HIPAA compliance requirements.

My goal is to combine modern software engineering, cloud technologies, and healthcare innovation to help organizations build smarter digital experiences that improve patient engagement, operational efficiency, and healthcare delivery.

### 📫 Connect with Me

- 💼 **LinkedIn**: [mubashirali822](https://linkedin.com/in/mubashirali822)
- 📧 **Email**: [alimubashir822@gmail.com](mailto:alimubashir822@gmail.com)
- 🌐 **Website**: [medclinicx.com](https://www.medclinicx.com/)

⭐ *Building the next generation of digital healthcare technology.*
