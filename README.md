# Streakly Habit Tracker

A mobile-first Progressive Web App for building and tracking daily habits. Features a bold black & orange theme, offline support, and streak tracking — all without a backend.

---

## Project Overview

Streakly lets users sign up, log in, create daily habits, mark them complete each day, and watch their streaks grow. All data is stored locally in the browser via `localStorage`, so there is no server, no database, and no network dependency after the first load. The app can be installed as a PWA on mobile and desktop and works fully offline.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS  
**Testing:** Vitest · React Testing Library · Playwright

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser (for E2E tests only)
npx playwright install chromium
```

---

## Run Instructions

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Serve production build
npm run start
```

---

## Test Instructions

```bash
# Unit tests
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires a running server — starts automatically)
npm run test:e2e

# Run all three suites in sequence
npm test
```

Coverage is reported after `test:unit`. The threshold is 80% line coverage across `src/lib`.

---

## Local Persistence Structure

All data is persisted in `localStorage` under three keys. There is no remote database or auth service.

### `habit-tracker-users` — `User[]`

Stores all registered accounts.

```ts
type User = {
  id: string;        // crypto.randomUUID()
  email: string;
  password: string;  // plain text (development only — see Trade-offs)
  createdAt: string; // ISO 8601
};
```

### `habit-tracker-session` — `Session | null`

Tracks the currently logged-in user. Set on login/signup, cleared on logout.

```ts
type Session = {
  userId: string;
  email: string;
};
```

### `habit-tracker-habits` — `Habit[]`

Stores all habits for all users. Each habit is scoped to a user via `userId`.

```ts
type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;   // ISO 8601
  completions: string[]; // array of 'YYYY-MM-DD' date strings
};
```

Streaks are calculated client-side from the `completions` array by `src/lib/streaks.ts` — no separate streak field is stored.

---

## PWA Support

Streakly is installable and works offline via three pieces:

**1. `public/manifest.json`**  
Declares the app name, short name, icons, theme colour (`#f97316`), background colour (`#000000`), and `display: standalone` so the app launches without browser chrome when installed.

**2. `public/sw.js`**  
A service worker that:
- On `install`: pre-caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`)
- On `activate`: clears any stale caches from previous versions
- On `fetch`: uses a network-first strategy — serves fresh content when online, falls back to the cache when offline

**3. `src/components/shared/ServiceWorkerRegister.tsx`**  
A client component that calls `navigator.serviceWorker.register('/sw.js')` inside a `useEffect`, so the SW is registered after the first render without blocking hydration.

The `<link rel="manifest">` and `<meta name="theme-color">` tags are set in `app/layout.tsx` via Next.js `metadata` and `viewport` exports.

---

## Accessibility

The app uses semantic HTML, visible focus states, keyboard-accessible controls, labelled form inputs, and button elements for all interactive actions.

---

## Trade-offs & Limitations

| Area | Decision | Reason / Limitation |
|---|---|---|
| **Auth security** | Passwords stored in plain text in `localStorage` | Acceptable for a local-only prototype; production would use hashed passwords and a server-side session |
| **Data scope** | Single device / single browser only | `localStorage` is not synced across devices, browsers, or incognito windows |
| **Frequency** | Only `daily` habits supported | Weekly, custom, and time-of-day frequencies are not implemented |
| **Offline writes** | Writes go straight to `localStorage` | No conflict resolution if two tabs write simultaneously — last write wins |
| **No server** | No API, no database | Means zero hosting cost and zero latency, but also no data backup or cross-device sync |
| **Icons** | Programmatically generated PNGs | A designer-produced icon set would improve App Store / Play Store presentation |

---

## Test File → Behavior Map

| Test File | Behaviors Verified |
|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` lowercases and hyphenates names, trims outer spaces, collapses repeated spaces, strips non-alphanumeric characters |
| `tests/unit/validators.test.ts` | `validateHabitName` returns an error for empty input, returns an error when the name exceeds 60 characters, returns the trimmed value on success |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` returns 0 for empty completions, returns 0 when today is not completed, counts consecutive days correctly, ignores duplicate dates, breaks the streak when a day is missing |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` adds a date when absent, removes a date when present, does not mutate the original habit, deduplicates completion dates |
| `tests/integration/auth-flow.test.tsx` | Signup form creates a session; duplicate email shows an error; login form stores an active session; invalid credentials show an error |
| `tests/integration/habit-form.test.tsx` | Empty name shows a validation error; new habit appears in the list; editing preserves id, createdAt, and completions; delete requires confirmation; toggling completion updates the streak display |
| `tests/e2e/app.spec.ts` | Splash screen shows and redirects unauthenticated users to `/login`; authenticated users redirect to `/dashboard`; unauthenticated `/dashboard` access redirects to `/login`; full signup → dashboard flow; login loads only that user's habits; habit creation from dashboard; completing a habit updates the streak; data persists after page reload; logout redirects to `/login`; cached app shell loads when offline |
