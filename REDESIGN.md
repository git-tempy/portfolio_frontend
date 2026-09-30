# DesOne frontend redesign

## Light theme refinement

Light mode uses graphite body text, deep green/teal headings, soft lime action fills and white glass cards. Accent text and button backgrounds use separate colors. Navigation, skill icons, hover/focus states, forms, filters and the media viewer have light-specific styling. The three background glows are quieter in light mode. Public project hashtags remain hidden; admin editing is retained.

## Run locally

Install dependencies with `npm ci`, copy `.env.example` to `.env.local`, then run `npm run dev`. Set `VITE_API_BASE_URL` to the Django backend origin. Validate with `npm run lint` and `npm run build`.

All environments use the configured Django API. There is no demo API, fetch interception, sample project data or unauthenticated admin preview route. Admin-managed content (profile, résumé, education, certificates, skills, traits, experience and projects) comes from the existing database through the same endpoints. Missing content shows an empty/error state rather than sample records. Navigation, hero copy and contact links remain frontend content as in the original application.

Public routes are `/`, `/portfolio`, `/portfolio/:slug`; the existing admin route is `/desone_adminstration`. Vercel SPA rewrites support direct links. Every fresh page load uses the first supported browser/device language (UZ, ENG, RU or JP), with English as fallback. Stored choices and incoming lang query parameters do not override detection. Manual language changes apply during the current visit and are preserved across client-side routes. Some new helper/error messages use English outside Uzbek.

## Image handling

New project uploads accept JPG/PNG/WebP: up to 20 gallery images, 40 MB each and 150 MB per selection. Sequential worker processing offers progress and cancellation. Covers are bounded to 1600 px width; artwork to 2560 px width, 16 megapixels and 20000 px height. Small images are not enlarged. Aspect ratio and transparency are preserved; output may use WebP, so original encoding is not guaranteed.

Viewers support original proportions, zoom, fit-to-width, keyboard navigation, touch swipe/pinch and drag-to-pan. PDFs render on canvas without built-in download controls. Only the résumé offers a download link. Public content cannot be made impossible to save or screenshot; this is a UI restriction, not DRM.

PDFs served from another origin need CORS permission. The résumé viewer and download use only `about.resume_pdf` uploaded through the admin panel; there is no static PDF fallback.

## Backend follow-up

This branch changes the frontend only. The current API supports repeated `images` fields on project creation, but does not update gallery images through PATCH. Existing project galleries therefore remain read-only in the editor; cover/text editing is available. Gallery replacement needs backend implementation.

Existing admin authentication and API authorization need backend hardening before public mutation endpoints are exposed. The server must independently validate uploads and produce optimized image variants; client-side optimization alone does not enforce server safety or performance limits. Real message sending, persistence and translated content need a running backend integration check.

The redesign removes the blocking welcome prompt and compulsory résumé lead form. Their previous visitor/lead collection behavior is not active in the new public flow; review analytics requirements during the backend stage.

## Verification

Lint and production build; Chromium layouts at 320, 390, 768, 1024 and 1440 px in both themes; four-language switching; mobile menu; gallery keyboard navigation, current-thumbnail selection and preserved search on close; PDF canvas rendering and résumé-only download control. Upload tests include large covers, long artwork, transparency, no upscaling, unsupported formats and cancellation. Real mobile devices and live backend integration still need checks.
