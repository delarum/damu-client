# DamuLink — Frontend

A comprehensive Kenyan blood and organ donor platform connecting donors, hospitals, and recipients in real time. This is the web frontend: a multi-portal React application with three distinct user interfaces (Donor, Hospital, and Platform Admin) built on a dark "ruby-night" design system.

## Tech Stack

- **React 18** + **Vite** — Fast development and build tooling
- **Tailwind CSS v4** — Utility-first styling with custom theme tokens
- **React Router v6** — Multi-portal routing with protected routes
- **Framer Motion** — Animations and transitions (intro sequence, page transitions)
- **Axios** — HTTP client with interceptors for JWT authentication
- **JWT** — Token-based authentication with refresh token rotation
- **React Context** — Global state management for auth and language

## Features

### 🔴 Donor Portal
- **Registration & Verification** — Email-based OTP verification (no phone required)
- **Profile Management** — Blood type, organ pledges, location, contact preferences
- **Donor Dashboard** — Credits, badges, donation history, availability status
- **Contact Requests** — Review and respond to hospital requests
- **Gamification** — Badges, points, leaderboards
- **Verification** — ID verification workflow
- **Accessibility** — Language switching (English/Swahili), high contrast mode

### 🏥 Hospital Portal
- **Registration & Approval** — Facility registration with admin approval workflow
- **Hospital Dashboard** — Donor map, request statistics, subscription status
- **Donor Search** — Search by blood type, organ type, radius, availability
- **Contact Requests** — Initiate and track contact requests with donors
- **Staff Management** — Add/remove staff members with role-based access
- **Subscription Management** — Tier-based plans (Starter, Professional, Enterprise, Public)
- **Hospital Admin Dashboard** — Scoped admin panel for hospital administrators
- **Profile Management** — Facility details, license upload

### ⚙️ Platform Superadmin Portal
- **Dashboard** — Platform-wide metrics and statistics
- **Hospital Management** — Approve/reject/suspend hospital registrations
- **User Management** — View, activate/deactivate, reset passwords for all users
- **Audit Logs** — Immutable audit trail of all admin actions
- **Role-Based Access** — Separate permissions for superadmin vs hospital admin

### 🔐 Authentication & Security
- **Email-Based OTP** — All authentication uses email instead of SMS
- **Three User Roles** — Donor, Hospital Admin, Platform Superadmin
- **JWT Tokens** — Access and refresh tokens with automatic rotation
- **Protected Routes** — Role-based route guards for all portals
- **Session Isolation** — Separate token storage per portal (donor/hospital/admin)
- **Hospital Approval** — Unapproved hospitals cannot access portal
- **Immutable Audit Logs** — All admin actions logged and protected

### 🌍 Localization
- **Bilingual Support** — English and Swahili (Kiswahili)
- **Dynamic Language Switching** — No page reload required
- **Comprehensive Translations** — All UI text translated

### 🎨 Design System
- **Dark Ruby-Night Theme** — Blood-donation thematic color scheme
- **Responsive Design** — Mobile-first approach, works on all screen sizes
- **Accessibility** — High contrast mode, screen reader support, keyboard navigation
- **Consistent Components** — Reusable UI components across all portals

## Project Structure

```
damu-client/
├── src/
│   ├── assets/                    # Static assets (images, icons)
│   │   └── hero.png
│   ├── components/                # Shared UI components
│   │   ├── AccessibilityMenu.jsx  # Accessibility settings panel
│   │   ├── AdminProtectedRoute.jsx # Admin route guard
│   │   ├── AuthSidePanel.jsx      # Auth page side panel
│   │   ├── BloodFlow.jsx          # Blood flow animation
│   │   ├── DonorMap.jsx           # Interactive donor map
│   │   ├── Footer.jsx             # Site footer
│   │   ├── HospitalProtectedRoute.jsx # Hospital route guard
│   │   ├── PageShell.jsx          # Page wrapper with header/footer
│   │   ├── ProtectedRoute.jsx     # Donor route guard
│   │   ├── VideoIntro.jsx         # Intro animation
│   │   └── VideoIntro.css
│   ├── data/                      # Static data
│   │   └── organDonationInfo.js
│   ├── lib/                       # Core libraries and utilities
│   │   ├── AdminAuthContext.jsx    # Admin authentication state
│   │   ├── AuthContext.jsx         # Donor authentication state
│   │   ├── HospitalAuthContext.jsx # Hospital authentication state
│   │   ├── LanguageContext.jsx     # Internationalization (i18n)
│   │   ├── UseCountUp.jsx          # Animation hook
│   │   ├── api.js                  # Core API client (donor endpoints)
│   │   ├── apiHospital.js          # Hospital and admin API endpoints
│   │   └── useNewBadges.js         # Badge management hook
│   ├── pages/                     # Page components
│   │   ├── About.jsx               # Donor about page
│   │   ├── AdminAuditLogs.jsx      # Admin audit log viewer
│   │   ├── AdminDashboard.jsx      # Platform admin dashboard
│   │   ├── AdminHospitals.jsx      # Hospital approval management
│   │   ├── AdminLogin.jsx          # Admin login
│   │   ├── AdminUsers.jsx          # User management
│   │   ├── Badges.jsx              # Donor badges page
│   │   ├── ContactRequests.jsx     # Donor contact requests
│   │   ├── Credits.jsx             # Credits management
│   │   ├── Dashboard.jsx           # Donor dashboard
│   │   ├── DonationHistory.jsx     # Donation history
│   │   ├── DonorAvatarPanel.jsx    # Donor avatar/body visualization
│   │   ├── HospitalAbout.jsx       # Hospital about page
│   │   ├── HospitalAdminDashboard.jsx # Hospital admin panel
│   │   ├── HospitalDashboard.jsx   # Hospital main dashboard
│   │   ├── HospitalLogin.jsx       # Hospital login
│   │   ├── HospitalProfile.jsx     # Hospital profile management
│   │   ├── HospitalRegister.jsx    # Hospital registration
│   │   ├── HospitalRequests.jsx    # Hospital contact requests
│   │   ├── HospitalSearch.jsx      # Donor search
│   │   ├── HospitalStaff.jsx       # Staff management
│   │   ├── HospitalSubscription.jsx # Subscription management
│   │   ├── Landing.jsx             # Landing page
│   │   ├── Login.jsx               # Donor login
│   │   ├── Profile.jsx             # Donor profile
│   │   ├── ProfileSetup.jsx        # Donor profile setup
│   │   ├── SignUp.jsx              # Donor registration
│   │   ├── ThirdPartyApply.jsx     # Third-party data access
│   │   └── Verification.jsx        # ID verification
│   ├── App.jsx                    # Main app component with routes
│   ├── index.css                  # Global styles and Tailwind imports
│   └── main.jsx                   # React entry point
├── public/                        # Public assets
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
└── .env                           # Environment variables (not in git)
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **DamuLink Backend** running at `http://127.0.0.1:8000` (see backend repo)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/delarum/damu-client.git
cd damu-client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_APP_NAME=DamuLink
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on codebase |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://127.0.0.1:8000/api/v1` |
| `VITE_APP_NAME` | Application name | `DamuLink` |

## Routing Structure

### Public Routes
- `/` — Landing page with intro animation
- `/signup` — Donor registration
- `/login` — Donor login
- `/hospital/login` — Hospital login
- `/hospital/register` — Hospital registration
- `/admin/login` — Platform admin login

### Donor Routes (Protected)
- `/dashboard` — Donor dashboard
- `/profile` — Donor profile
- `/profile-setup` — Profile setup wizard
- `/requests` — Contact requests
- `/donations` — Donation history
- `/credits` — Credits management
- `/badges` — Badges and achievements
- `/verification` — ID verification
- `/third-party/apply` — Third-party data access
- `/about` — About DamuLink

### Hospital Routes (Protected + Approval Required)
- `/hospital/dashboard` — Hospital main dashboard
- `/hospital/admin` — Hospital admin panel
- `/hospital/search` — Donor search
- `/hospital/requests` — Contact requests
- `/hospital/profile` — Facility profile
- `/hospital/staff` — Staff management
- `/hospital/subscription` — Subscription management
- `/hospital/about` — Hospital about page

### Admin Routes (Protected + Superadmin Role)
- `/admin/dashboard` — Platform admin dashboard
- `/admin/hospitals` — Hospital approval management
- `/admin/users` — User management
- `/admin/audit-logs` — Audit log viewer

## Authentication Flow

### Email-Based OTP System

1. **Registration** — User enters email and password
2. **OTP Verification** — System sends 6-digit code to email
3. **Account Creation** — After OTP verification, account is created
4. **Login** — User logs in with email and password
5. **Token Management** — JWT access/refresh tokens stored in localStorage
6. **Auto-Refresh** — Access tokens automatically refresh before expiry

### Session Management

- **Separate token storage** for each portal (donor/hospital/admin)
- **Automatic token refresh** on 401 errors
- **Persistent sessions** across browser tabs
- **Secure logout** — Clears all tokens and redirects to landing

### Role-Based Access

| Role | Access Level |
|------|--------------|
| `donor` | Donor portal only |
| `hospital_admin` | Hospital portal + admin panel |
| `hospital_staff` | Hospital portal (limited) |
| `superadmin` | Platform admin portal |

## API Integration

### Base URL
All API calls are relative to `VITE_API_BASE_URL` (default: `http://127.0.0.1:8000/api/v1`)

### API Clients

**Core API (`src/lib/api.js`)** — Donor endpoints:
- Authentication (register, login, verify OTP, resend OTP, logout)
- Donor profiles and history
- Matching and contact requests
- Gamification (badges, leaderboards)
- Credits and redemptions
- Verification

**Hospital API (`src/lib/apiHospital.js`)** — Hospital and admin endpoints:
- Hospital profiles and staff
- Donor search and matching
- Contact requests
- Subscriptions
- Admin operations (hospitals, users, audit logs, stats)

### Request Flow

1. **Request Interceptor** — Adds JWT token to headers
2. **Response Interceptor** — Handles 401 errors with token refresh
3. **Error Handling** — Normalizes API errors into user-friendly messages
4. **Loading States** — Shows loading indicators during requests

## Design System

### Color Palette

**Primary Colors:**
- `ruby-night` — Deep dark background (#220301)
- `ruby` — Primary accent/CTA (#570300)
- `ruby-warm` — Secondary accent
- `mist` — Light accent for highlights (#F7E493)
- `cream` — Text on dark backgrounds (#FFFBF5)

**Neutral Colors:**
- `ink` — Dark text on light backgrounds
- `clay` — Light background (#f5f0eb)
- `white` — Card backgrounds
- `sage` — Success states

### Typography

- **Display Font** — Headings and brand text
- **Body Font** — UI text and content
- **Mono Font** — Code, IDs, timestamps

### Components

All components follow consistent patterns:
- Rounded corners (`rounded-3xl` for cards, `rounded-full` for buttons)
- Subtle borders (`border-ink/8`, `border-ruby/15`)
- Hover states with color transitions
- Focus rings for accessibility
- Loading and error states

## Internationalization

### Supported Languages
- **English (en)** — Default
- **Swahili (sw)** — Full translation

### Usage

```jsx
import { useLanguage } from "../lib/LanguageContext";

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t("auth.login.title")}</h1>
      <button onClick={() => setLanguage("sw")}>Swahili</button>
    </div>
  );
}
```

### Translation Keys

All UI text is stored in `src/lib/LanguageContext.jsx`:
- `auth.*` — Authentication flows
- `field.*` — Form field labels
- `hospital.*` — Hospital portal text
- `dashboard.*` — Dashboard content
- `profile.*` — Profile pages
- `requests.*` — Contact requests
- And many more...

## State Management

### Context Providers

**AuthContext** — Donor authentication state
- `user` — Current user object
- `donorProfile` — Donor profile data
- `loading` — Auth loading state
- `login()` — Login function
- `register()` — Registration function
- `logout()` — Logout function

**HospitalAuthContext** — Hospital authentication state
- `user` — Current user object
- `hospitalProfile` — Hospital profile data
- `loading` — Auth loading state
- `login()` — Login function
- `register()` — Registration function
- `logout()` — Logout function

**AdminAuthContext** — Admin authentication state
- `user` — Current user object
- `loading` — Auth loading state
- `login()` — Login function
- `logout()` — Logout function

**LanguageContext** — Internationalization
- `language` — Current language code
- `setLanguage()` — Language switcher
- `t()` — Translation function
- `languages` — Available languages

## Accessibility

### Features
- **Language Switching** — English/Swahili toggle
- **High Contrast Mode** — Enhanced visibility
- **Dark Mode** — Default ruby-night theme
- **Keyboard Navigation** — Full keyboard support
- **Screen Reader Support** — ARIA labels and semantic HTML
- **Focus Management** — Visible focus indicators

### Accessibility Menu
Located in bottom-right corner, provides:
- Language selection
- Color mode (Default/Dark/High Contrast)
- Font size adjustment

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Code Splitting** — Routes loaded on demand
- **Lazy Loading** — Components and pages lazy-loaded
- **Optimized Images** — WebP format with fallbacks
- **Minimal Bundle** — Tree-shaking and dead code elimination
- **Fast Refresh** — HMR for rapid development

## Contributing

### Branch Naming Convention
- `ft-<feature-name>` — New features
- `fx-<bug-name>` — Bug fixes
- `chore-<task>` — Maintenance tasks

### Development Workflow

1. Create feature branch from `dev`
2. Make changes and test locally
3. Run `npm run lint` to check code quality
4. Commit with descriptive message
5. Push and open PR against `dev`
6. Wait for code review and approval

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Write meaningful commit messages

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Deploy to Vercel/Netlify

1. Connect repository to hosting platform
2. Set environment variables in platform dashboard
3. Deploy automatically on push to main

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.damulink.co.ke/api/v1
VITE_APP_NAME=DamuLink
```

## Troubleshooting

### Intro Animation Repeats on Logout
- The intro animation state is persisted in `localStorage`
- After first view, it will be skipped automatically
- To reset: Clear localStorage key `damulink_intro_done`

### API Calls Failing
- Check backend is running at `VITE_API_BASE_URL`
- Verify CORS is configured on backend
- Check browser console for error details
- Ensure tokens are not expired

### Hospital Access Denied
- Hospital must be approved by admin (`is_approved=true`)
- Check hospital profile in admin panel
- Contact platform admin for approval

## License

Internal/proprietary — DamuLink Platform

## Support

For issues and questions:
- GitHub Issues: https://github.com/delarum/damu-client/issues
- Email: support@damulink.co.ke

---

**Built with ❤️ for Kenya's healthcare ecosystem**