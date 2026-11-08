# Deploy to Vercel

This app is static HTML, CSS and JavaScript. Its calculations run in the browser;
progress and notes use localStorage. The current app needs no backend or database.

1. Sign in to Vercel and import `santi34mg/analisis-complejo` from GitHub.
2. Keep the project Root Directory at the repository root (`.`), so the PDF is included.
3. The checked-in `vercel.json` configures the framework as Other, skips dependency
   installation, runs `node scripts/build.cjs` and publishes `public/`.
4. Deploy. The root URL redirects to `/materiales/`, preserving relative asset and
   PDF links. No environment variables are required.

Vercel's Hobby plan is free for personal, non-commercial projects within its limits:
https://vercel.com/docs/plans/hobby

After deployment, open the site and check a flashcard, a lab, and both PDF links
(the header and a section reference). Mark a card learned and reload to check persistence.
Progress previously saved under localhost or a local file stays in that browser
origin; it does not automatically transfer to the deployed URL.

## Optional backend for synced progress

If accounts and progress across devices are wanted, Supabase Free provides a hosted
database and authentication: https://supabase.com/pricing
That requires adding sign-in, per-user progress storage, database access policies
and synchronization to this app. Merely deploying a backend will not sync the
existing localStorage data. No backend is configured in the current deployment.

## Local deployment build

Run `node scripts/build.cjs`, then `python -m http.server 8000 --directory public`.
Open http://localhost:8000/materiales/ to check the published files locally.
