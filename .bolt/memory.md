# Project memory

## Product intent & audience

- Web app for **شركة أبوطلال (Abu Talal)**, an advertising, marketing, e-marketing, programming, and development company.
- Primary audience: Arabic-speaking potential clients seeking digital marketing and development services.
- Business contact numbers: **778215553** and **700897775** (Yemen country code +967).
- Contact channels: WhatsApp (wa.me/967…) and direct call (tel:) for both numbers.

## Brand personality & voice

- Professional, premium, trustworthy Arabic-language brand presence.
- Content fully in **Arabic (RTL)**.
- Company name rendered as **أبوطلال** in Arabic.

## Visual design & UX direction

- **Language & direction:** Arabic RTL throughout (`dir="rtl"`, `lang="ar"`).
- **Typography:** Cairo font family, loaded and applied globally.
- **Color scheme:** Blue, white, and red — implemented as a 6-ramp Tailwind color system (primary blue, accent red, white surfaces).
- **Aesthetic:** Premium, non-cookie-cutter: animated gradients, floating decorative elements, grid background patterns, scroll-reveal animations.
- **Components built:** Navbar, Hero (with contact CTAs + numbers), animated Stats counters, Services cards (6 services: advertising, e-marketing, programming, graphic design, mobile apps, SEO), About with 4-step process timeline, Portfolio cards (hover effects), Testimonials (star ratings), Contact form (composes WhatsApp message), Footer (quick links, scroll-to-top), floating WhatsApp/contact button with expandable panel.
- **Responsive:** Mobile, tablet, desktop breakpoints.
- **Interaction patterns:** Floating contact button auto-opens after delay; contact form opens WhatsApp with prefilled message; scroll-to-top in footer.
- **Icons:** lucide-react used for UI/logo icons.

## Decisions, constraints & rationale

- Framework: Vite + React + Tailwind CSS + lucide-react; `@/` path alias maps to `src/`.
- Even though user asked for an "Android app," the deliverable is a responsive web app (framework constraint) — full Arabic RTL PWA-style experience instead of native Android.
- Contact form submission routed through WhatsApp deep link rather than a backend/API — no server infrastructure assumed.
- Country code inferred as +967 (Yemen) from number format.
- No additional UI/icon packages installed beyond lucide-react.

## Open questions & assumptions

- No backend or database is available; contact form relies on WhatsApp only.
- Portfolio/testimonials content is placeholder — real project names and client reviews not provided by user.
- No analytics, SEO meta, or deployment target specified yet.
- PWA/native packaging not configured; if true Android APK is needed, would require Capacitor/TWA wrapper (not done).
- Logo/brand mark beyond text not supplied; using lucide icon as placeholder branding.