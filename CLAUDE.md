# RUMS – Regulatory Utility Management System

## Project Context
RUMS is an internal back-office MIS dashboard for the Rwanda Utilities Regulatory Authority (RURA).
It is built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
The current phase is **UI-only** — no backend yet. All data comes from mock files in `src/lib/mock-data/`.

## Tech Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode — no `any` types)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts
- **Tables:** @tanstack/react-table
- **Animations:** Framer Motion (subtle only)
- **Icons:** lucide-react exclusively
- **Theme:** next-themes for dark/light mode

## Design System

### Color Palette
- Primary background: `#0D1B2A` (deep navy)
- Accent / brand: `#00C2CB` (electric teal)
- Sidebar background: `#0D1B2A`
- Card background: white (light) / `#112240` (dark)
- Success: `#10B981`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Text primary: `#1E293B`
- Text secondary: `#64748B`

### Typography
- Font: Inter (already configured in Next.js)
- Headings: font-semibold or font-bold
- Body: font-normal, text-sm or text-base

### Component Conventions
- All pages use the `(dashboard)` route group which wraps Sidebar + Header
- Every page starts with a `<PageHeader>` component (title + subtitle + optional action button)
- Data tables always use the shared `<DataTable>` component built on @tanstack/react-table
- Status values always use the shared `<StatusBadge>` component
- Loading states always use `<LoadingSkeleton>`
- Empty states always use `<EmptyState>` with an icon and message

## Coding Rules
1. **No backend calls yet** — use only mock data from `src/lib/mock-data/`
2. **No `any` in TypeScript** — define all types in `src/types/index.ts`
3. **No inline styles** — Tailwind classes only
4. **Client components** must have `"use client"` at the top
5. **Server components** are the default — keep them server-side where possible
6. All components must be **fully responsive** (mobile → desktop)
7. Use **named exports** for all components
8. Keep components **small and focused** — split if over 150 lines
9. All mock data must be **realistic and Rwanda-relevant** (operator names, sectors: Telecom, Energy, Water, Transport)

## Modules & Routes
| Module | Route |
|---|---|
| Central Dashboard | `/` |
| CLMS Integration | `/clms` |
| License Management | `/licenses` |
| Consumer Complaints | `/complaints` |
| Compliance Monitoring | `/compliance` |
| Fraud & Anomaly Detection | `/fraud` |
| Reports & Dashboards | `/reports` |
| User & Role Management | `/users` |
| Audit & Activity Log | `/audit` |
| Alert & Notification Center | `/alerts` |
| Regulatory Workflow Engine | `/workflows` |

## What "Done" Looks Like for Each Page
Every page must have:
- [ ] PageHeader with title, subtitle, and action button where relevant
- [ ] Realistic mock data (minimum 8–10 records)
- [ ] Correct loading skeleton
- [ ] Empty state component
- [ ] Fully responsive layout
- [ ] Dark mode compatible

## File Naming
- Components: PascalCase (`LicenseTable.tsx`)
- Hooks: camelCase with `use` prefix (`use-sidebar.ts`)
- Mock data: kebab-case (`mock-licenses.ts`)
- Pages: always `page.tsx` inside route folder