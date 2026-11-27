# SAU Admissions Portal — Website Review

**Review scope:** Complete project tree, 50 HTML pages, shared CSS and JavaScript, images, local navigation, Supabase-related files, and the available backend scripts.

**Review date:** 2026-11-24

**Review method:** Static source review, local-asset and internal-link checking, HTML structure analysis, CSS/JavaScript source review, and browser testing through a local static server on desktop/mobile viewport sizes.

**Verification key**

- **Verified:** Directly observed in source or browser testing.
- **Could not be verified:** Production hosting, database state, live Supabase project, official institutional data, or behaviour requiring unavailable credentials/services.

---

## 1. Project Overview

The project is a static HTML/CSS/JavaScript admissions website with 50 HTML pages, one shared stylesheet, one shared frontend script, one small Express/SQLite backend script, six photos, and category and programme detail pages.

The intended areas are present as site sections/pages:

- Main homepage
- Admissions overview
- Application form
- Notifications
- Bachelor's, Master's, and PhD programme lists
- Programme detail pages
- Student portal login
- Help bot UI

The project does not currently contain a complete, working static deployment or complete backend. The README describes a static site, while [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js) expects a PHP API, and [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) implements a separate Express/SQLite API. No PHP API file, Express package manifest, environment file, or database migration file is present.

---

## 2. Current Folder Structure

The inspected structure is:

```text
README.md
WEBSITE_REVIEW.md
.gitignore
index.html
admissions.html
apply.html
notifications.html
photos/
  sau.jpg
  saucampus.jpg
  saucampus2.jpg
  sauclassroom.jpg
  saulogo.png
  saustudents.jpg
programmes/
  bachelor.html
  master.html
  phd.html
  bachelors/ (14 detail/listed HTML pages)
  masters/ (13 detail pages)
  phd/ (13 detail pages)
src/
  script.js
  sever.js
student-portal/
  index.html
style/
  style.css
```

No `supabase/` directory or migration files are currently present. This is consistent with the absence of a Supabase integration in the source, not with a Supabase project being configured elsewhere.

### 2.1 Structure observations

- **Asset organization is simple and understandable.** Photos and global CSS/JavaScript are in dedicated folders.
- **Naming is mostly consistent.** HTML files use descriptive hyphenated names for programmes.
- **One structural inconsistency:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) is misspelled relative to “server.” It should be treated as a significant backend file name inconsistency, although no runtime imports were found.
- **No duplicate or unused photo files could be identified.** All six local photos exist and are referenced from at least one page. The external student-portal logo is not in the project.
- **No duplicate HTML files or obviously duplicated programme detail files were found.** However, many programme pages share nearly identical markup and should be generated or standardized to reduce maintenance risk.
- **The expected profile page is missing.** No `profile.html` exists anywhere in the project.
- **No admin portal exists as a separate page or directory.**
- **No package manifest or dependency lockfile exists.** This prevents reproducible installation for [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js).

---

## 3. Pages Reviewed

The following areas were reviewed:

| Area | Files | Result |
|---|---|---|
| Homepage | [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html) | Reviewed source and browser rendering |
| Admissions | [admissions.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/admissions.html) | Reviewed source and browser rendering |
| Application | [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html) | Reviewed source and browser rendering |
| Notifications | [notifications.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/notifications.html) | Reviewed source and browser rendering |
| Student portal | [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html) | Reviewed source and browser rendering |
| Bachelor's programmes | [programmes/bachelor.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/programmes/bachelor.html) and 14 listed detail pages | Source review and link audit |
| Master's programmes | [programmes/master.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/programmes/master.html) and 13 detail pages | Source review and link audit |
| PhD programmes | [programmes/phd.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/programmes/phd.html) and 13 detail pages | Source review and link audit |
| Backend | [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js), [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) | Source review |

Not directly verified:

- Official institutional accuracy of dates, courses, fees, eligibility, or notifications
- Live Supabase/Express/PHP deployment
- Real applicant submissions and database writes
- User authentication against a live service
- Production host behaviour

---

## 4. Design and UI Review

### 4.1 Visual system

The site uses a consistent navy, slate, light grey, and white palette, with `Public Sans` for body/UI text and `Source Serif 4` for headings. Cards, border radii, footer treatment, programme sections, and navigation generally follow a consistent visual language.

### 4.2 Header and navigation

The sticky header is clear and the logo plus Admissions brand is recognizable. The desktop/mobile navigation is generally understandable.

Issues:

#### Brand dropdown contains placeholder links

- **Location:** [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html), [admissions.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/admissions.html), [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html), and most programme pages.
- **Problem:** The “ABOUT SAU,” “FACULTIES & DEPARTMENTS,” “STUDENT LIFE,” “MEDIA,” “PEOPLE,” “PLACEMENTS,” and “CAREER” dropdown items use empty `href` values or placeholder `href="#"`.
- **Why it matters:** The links do not lead to real destinations and can unexpectedly reload or remain at the top of the page.
- **Recommended solution:** Remove placeholder entries, link them to real pages, or clearly implement disabled items.
- **Priority:** **MEDIUM**

#### Header implementation differs between pages

- **Location:** [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html) and [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html)
- **Problem:** The homepage uses a nested brand structure and full nav; the student portal uses a simpler brand; several programme pages use a mixture of brand dropdown markup and standard nav.
- **Why it matters:** Header behaviour and spacing are less consistent across the site.
- **Recommended solution:** Extract a shared header pattern or use an automated template/component system.
- **Priority:** **LOW**

### 4.3 Cards and buttons

Programme cards, admission cards, notification entries, and portal containers are well structured and have clear hover states.

Potential issue: some external/placeholder content is presented as actionable. For example, fee, eligibility, scholarship, and important-date cards use `href="#"`, so they imply destinations that do not exist.

- **Location:** [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html), especially the “Important information” cards.
- **Description:** The four important-information cards are not real navigation targets.
- **Why it matters:** Users may expect actionable pages or documents.
- **Recommended solution:** Link to real pages/documents or remove the card links.
- **Priority:** **MEDIUM**

### 4.4 Footer

Footers are consistent in colour and contact information, but page-level footer markup varies and some only show a copyright line. This is a minor maintainability issue, not a confirmed user-facing layout defect.

---

## 5. Responsive Design Review

### 5.1 Verified browser behaviour

Browser testing at a 375 px viewport showed no document-level horizontal overflow:

- Document scroll width: `375`
- Document client width: `375`
- Body scroll width: `375`

Desktop viewport testing also loaded the homepage successfully. The shared breakpoint structure handles the main homepage, programme grids, facts grid, and help bot at 850 px and 600 px.

### 5.2 Navigation

- **Verified:** The mobile hamburger control appears and is controlled by `#menu-toggle`.
- **Verified:** The `.nav` menu switches to a stacked dropdown under 850 px.
- **Caveat:** The brand dropdown and main mobile nav can compete for the same header area because the header uses custom dropdown markup across several pages.

#### Mobile header/menu risk

- **Location:** [style/style.css](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/style/style.css), mobile header rules around the 850 px breakpoint.
- **Problem:** Brand dropdown, hamburger checkbox, and primary nav share a flexible header row with different markup across pages.
- **Why it matters:** The button and dropdown may overlap or reorder unexpectedly at intermediate widths.
- **Recommended solution:** Standardize markup and test 320 px, 375 px, 768 px, and 1024 px widths.
- **Priority:** **MEDIUM**

### 5.3 Images

Images use `max-width: 100%`, and key layout containers set fixed or responsive heights. No horizontal overflow was detected in the 375 px test.

### 5.4 Text overflow

The programme detail styles use `overflow-wrap: anywhere` for sidebar values and `text-wrap: balance` for large headings. Long programme names appear reasonably constrained. Full cross-page text-overflow testing was not completed, so edge conditions remain **could not be verified**.

### 5.5 Help bot

The help bot has a 370 px desktop window and a `calc(100vw - 30px)` mobile window, with a maximum viewport-based height. It is fixed to the lower-left and is potentially intrusive over page content, but it does scale to the mobile viewport.

---

## 6. HTML Review

### 6.1 Semantic HTML

The project uses `header`, `main`, `section`, `article`, `nav`, and `footer` elements on major pages. Programme cards and list structures are also reasonably semantic.

### 6.2 HTML audit results

Automated review of all 50 HTML pages found:

- **No duplicate `id` values within a single page**
- **No `<img>` elements missing an `alt` attribute**
- **All 50 HTML pages contain a page title**
- **All local links and asset references checked as existing**: 0 missing local references
- **No meta description exists on any reviewed page**

#### Missing meta descriptions

- **Location:** All 50 HTML pages.
- **Problem:** No page contains a `<meta name="description">`.
- **Why it matters:** Search-result snippets and sharing previews are less controllable.
- **Recommended solution:** Add a concise unique description to each page, especially category and programme detail pages.
- **Priority:** **MEDIUM**

### 6.3 Forms and labels

The application form, student login, and help-bot form have labels or `aria-label` attributes for the primary controls.

#### Application form mismatch

- **Location:** [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** The form markup contains name, email, phone, mode, level, and programme fields, but no password or confirm-password fields. The submit handler reads `applyForm.elements.password.value` and `applyForm.elements.confirm.value`.
- **Why it matters:** Submitting the form may throw a JavaScript `TypeError` before the application request is sent.
- **Recommended solution:** Add matching password/confirm fields or remove the password requirements and payload field consistently.
- **Priority:** **CRITICAL**

#### Programme preferences do not populate

- **Location:** [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** `#programme` begins disabled and contains only “Choose a level first.” No source code updates its options based on `#level`.
- **Why it matters:** Users cannot select a programme, and the form cannot pass the programme validation.
- **Recommended solution:** Implement level-specific option data and enable the select only after a valid level is selected.
- **Priority:** **CRITICAL**

#### Student login endpoint mismatch

- **Location:** [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** The login form is handled by JavaScript as a dynamic PHP API call, while the HTML form itself uses `action="#" method="post"` and [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) defines Express endpoints `/api/login` and `/api/apply`.
- **Why it matters:** Backend routing and endpoint implementation do not agree.
- **Recommended solution:** Choose one backend stack and update HTML, JavaScript, routes, and deployment configuration together.
- **Priority:** **CRITICAL**

#### Forgot password and help links are placeholders

- **Location:** [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html)
- **Problem:** “Forgot password?” and “Need help?” use `href="#"`.
- **Why it matters:** These essential account actions do not work.
- **Recommended solution:** Implement password-reset/help flows or link to real support resources.
- **Priority:** **HIGH**

### 6.4 IDs and accessibility

No duplicate IDs were found within each page. The help bot has `aria-label`, `aria-expanded`, and a polite live region. The dropdown may require hover or keyboard focus; no link to open it on touch beyond the surrounding brand link was confirmed.

The external student logo is served from a third-party host:

- **Location:** [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html)
- **Problem:** The image is not locally controlled and is loaded from `successphd.com`.
- **Why it matters:** The logo can disappear, change, become slow, or introduce a privacy/reliability concern.
- **Recommended solution:** Store an approved local copy in `photos/` and verify its licensing.
- **Priority:** **MEDIUM**

---

## 7. CSS Review

### 7.1 Organization

The site uses one 2982-line shared CSS file. The file has section comments and variables, but later sections override earlier styles extensively. This creates a large, partially layered stylesheet.

### 7.2 Duplicated rules

The stylesheet contains repeated definitions for `.programme-page`, `.programme-list-grid`, `.programme-list-card`, and responsive breakpoints. Some duplicate blocks appear to be intentional patch layers, but they increase specificity/conflict risk.

- **Location:** [style/style.css](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/style/style.css)
- **Problem:** Multiple general and scoped programme-page rules are declared in separate sections.
- **Why it matters:** Future changes may update one block while leaving another override unchanged.
- **Recommended solution:** Consolidate duplicate rules into one named pattern and remove obsolete overrides.
- **Priority:** **MEDIUM**

### 7.3 Potentially unused selectors

A source-based approximate audit identified selectors that may be unused in the current HTML, including profile/dashboard selectors and `search-status`, `status-badge`, `profile-actions`, and `submitted`/`accepted` badges. This is not a definitive browser-style audit because dynamic content was not executed.

- **Location:** [style/style.css](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/style/style.css)
- **Problem:** Profile CSS exists even though no profile HTML page exists.
- **Why it matters:** It adds maintenance overhead and suggests incomplete feature implementation.
- **Recommended solution:** Add the profile feature or remove dead CSS after verification.
- **Priority:** **LOW**

### 7.4 Responsive breakpoints

Breakpoints are found at 950 px, 900 px, 850 px, 768 px, 600 px, 560 px, and 480 px. The use of both 600 px and 560 px, 850 px and 768 px, and several later overrides is not inherently invalid but is fragmented.

- **Location:** [style/style.css](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/style/style.css)
- **Problem:** Breakpoints are not centralized or named consistently.
- **Why it matters:** Layout behavior is harder to predict and debug.
- **Recommended solution:** Standardize breakpoints and remove competing blocks.
- **Priority:** **LOW**

### 7.5 Conflicting styles

Some selectors are broad (`.apply-section` repeated), and later rules override initial values. The project should be tested as one complete build, but no CSS build tool or linting is configured.

---

## 8. JavaScript Review

### 8.1 Source loading

[src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js) is included on all major pages and all programme detail pages. No JavaScript 404 was found for the local script.

### 8.2 Console and runtime review

The homepage loaded under the local static server and no explicit console error was produced by the homepage's help-bot initialization. Full console monitoring across forms and all pages was not available without live backend endpoints.

### 8.3 Application submission

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** Password and confirm values are required even though the form does not contain those controls.
- **Problem:** The programme select is never populated.
- **Problem:** The PHP endpoint is hardcoded to `http://localhost:8000/api.php`.
- **Problem:** The successful redirect targets `profile.html`, which does not exist from any page context.
- **Why it matters:** Application submission cannot complete correctly in the current project.
- **Recommended solution:** Complete one backend flow, align fields, validate inputs, create the profile route, and remove local-only endpoint assumptions.
- **Priority:** **CRITICAL**

### 8.4 Login

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js), [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** Frontend calls PHP-style query endpoints while Express uses `/api/login`.
- **Problem:** The Express response returns applicant data but no authentication token or server-side session.
- **Problem:** The login success redirect targets `profile.html`, which is missing.
- **Why it matters:** Login cannot be production-safe or reliably complete.
- **Recommended solution:** Implement session-based authentication or signed tokens, update redirects, and add route guards.
- **Priority:** **CRITICAL**

### 8.5 Notifications

The notification search listener safely finds `#notification-search` and filters notice list items. The radio-category filter is implemented by CSS. Search itself is verified in source and should work when the search input and matching notices exist.

### 8.6 Help bot

The help-bot open/close, quick-action, and submit listeners are implemented. Bot links use absolute `/programmes/...`, `/apply.html`, and `/student-portal/index.html` paths.

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** Absolute root URLs can break if the site is deployed under a subdirectory or in a static host preview path.
- **Why it matters:** Help-bot links may lead to incorrect roots in non-root deployments.
- **Recommended solution:** Use relative links or a configured base URL.
- **Priority:** **MEDIUM**

### 8.7 Repeated DOM listeners

There are separate `DOMContentLoaded` listeners for application, login, notifications, and help bot, which is valid. [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js) also initializes the help bot on every page even where a bot form may exist only on selected pages, but it returns cleanly when required elements are missing.

No duplicate function names were found in [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js).

---

## 9. Supabase and Database Review

### 9.1 Supabase integration

No Supabase JavaScript client, Supabase URL, Supabase anon key, migration, table definition, or RLS policy was found in the project.

- **Location:** Entire project.
- **Problem:** The requested Supabase integration is not present.
- **Why it matters:** No Supabase notifications, applications, authentication, or database-backed profile data can be verified.
- **Recommended solution:** Either implement a documented Supabase integration or update the project documentation to state that Supabase is not used.
- **Priority:** **CRITICAL**

### 9.2 Alternative backend

[src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) is an Express/SQLite backend containing:

- Applicant table creation
- Password hashing with bcrypt
- Apply endpoint
- Login endpoint
- SQLite database storage

No `package.json` exists, so Express, SQLite, bcrypt, and CORS dependencies cannot be installed reproducibly.

#### No database schema migration

- **Location:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** Schema is created at runtime with `CREATE TABLE IF NOT EXISTS`.
- **Why it matters:** Runtime schema changes are not tracked or deployable in a controlled migration history.
- **Recommended solution:** Add migrations or a migration tool and initialize a persistent database volume in production.
- **Priority:** **HIGH**

#### Authentication response is not session-based

- **Location:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** Login returns applicant data and success text but no session cookie or signed token.
- **Why it matters:** The frontend cannot securely establish authenticated server-side access.
- **Recommended solution:** Use HTTP-only secure session cookies or short-lived signed tokens with server validation.
- **Priority:** **CRITICAL**

#### CORS configuration is unrestricted

- **Location:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** `cors()` enables cross-origin requests with the default permissive configuration.
- **Why it matters:** A production API is more exposed to unintended origins.
- **Recommended solution:** Restrict allowed origins and methods, and use HTTPS.
- **Priority:** **HIGH**

#### No server-side input validation

- **Location:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** Application values are inserted after only frontend validation; the server does not verify required fields, email format, password length, or allowed programme values.
- **Why it matters:** Direct API callers can submit invalid or malicious data.
- **Recommended solution:** Validate all fields on the server and use allowlists for mode/level/programme.
- **Priority:** **CRITICAL**

#### Password handling

- **Verified:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) hashes passwords with bcrypt and does not return `passwordHash` from the login response.
- **Problem:** Frontend [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js) sends the password over HTTP to `localhost:8000` unless the endpoint is changed to HTTPS.
- **Why it matters:** Localhost is not the production URL, and plain HTTP exposes credentials on insecure networks.
- **Recommended solution:** Use HTTPS only and do not store passwords outside bcrypt's server-side hash.
- **Priority:** **CRITICAL**

#### Student ID generation

- **Location:** [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Problem:** Student IDs are random six-digit values with the fixed prefix `SAU26-`, with no collision retry loop.
- **Why it matters:** Random collisions could cause insert failures and identifiers may be guessable.
- **Recommended solution:** Generate IDs using the database or a server-side collision-safe sequence.
- **Priority:** **MEDIUM**

### 9.3 Notification database integration

No notification database integration or backend query is present. Notifications are hard-coded HTML with no timestamps, external records, or Supabase subscriptions.

- **Location:** [notifications.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/notifications.html), [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html)
- **Problem:** Notice content is not loaded dynamically or stored in a database.
- **Why it matters:** Updates require editing HTML manually and cannot be managed by an admin.
- **Recommended solution:** Add a notification data source and authenticated admin management interface.
- **Priority:** **HIGH**

### 9.4 Row Level Security

Could not be reviewed because no Supabase configuration, schema, or policy file exists.

- **Priority classification:** **CRITICAL** until a database integration and RLS policy set is implemented.

### 9.5 Credentials

No Supabase service-role or known private credential was found. The `.gitignore` includes `.env`, which is good, but no credential configuration documentation exists.

---

## 10. Functionality Review

### 10.1 Main homepage

- **Verified:** Homepage loads at 375 px and desktop widths.
- **Verified:** Main in-page anchors and programme pages resolve to existing files.
- **Unverified:** Institutional accuracy of content.
- **Placeholder/problem:** Several cards and links use `#` or empty destinations.

### 10.2 Admissions page

- **Verified:** The page loads and presents entrance/direct modes.
- **Verified:** `apply.html?mode=entrance` and `apply.html?mode=direct` use existing application paths.
- **Problem:** The application form may not consume the `mode` query parameter because no script initialization code was found for it.
- **Priority:** **MEDIUM**

### 10.3 Notifications

- **Verified:** Search markup and JavaScript listener are present.
- **Verified:** CSS category filtering uses radio inputs and data attributes.
- **Problem:** Notification entries link to `#` instead of actual notices, documents, or detail pages.
- **Priority:** **HIGH**

### 10.4 Programme pages

- **Verified:** All programme-list links resolved to existing local HTML files.
- **Verified:** Programmes are organized under Bachelor's, Master's, and PhD directories.
- **Could not be verified:** Official course and eligibility accuracy.

### 10.5 Admin portal

- **Not found:** There is no admin portal, admin authentication, or admin notification/application management interface.
- **Priority:** **CRITICAL** if the intended portal includes applicant or notification administration.

### 10.6 Student portal

- **Verified:** Login UI loads.
- **Problem:** Placeholder forgot-password/help links.
- **Problem:** Login backend mismatch and missing profile page.
- **Priority:** **CRITICAL**

### 10.7 Search and filtering

- Notification text search works from source review.
- Notification radio/category filtering is CSS-driven.
- Programme search markup may exist on category pages, but no generalized search implementation is required or documented.

### 10.8 Internal links

The automated local-link audit found 0 missing local file references among all HTML pages. This does not cover placeholder `#`, empty `href`, or the unverified HTTP response of external resources.

---

## 11. SEO and Performance

### 11.1 Metadata

- Titles exist on all 50 pages.
- No meta descriptions exist.
- No canonical tags, Open Graph tags, Twitter card tags, robots tags, or sitemap/robots files were found.
- There is no structured data.

- **Location:** All HTML `<head>` sections.
- **Problem:** Search engine and social preview metadata is incomplete.
- **Recommended solution:** Add descriptions, canonical URLs, Open Graph/Twitter metadata, and a sitemap/robots file.
- **Priority:** **MEDIUM**

### 11.2 Image optimization

Verified image sizes:

| File | Size |
|---|---:|
| `photos/saucampus2.jpg` | 1.4 MB |
| `photos/saucampus.jpg` | 642 KB |
| `photos/sau.jpg` | 414 KB |
| `photos/saustudents.jpg` | 377 KB |
| `photos/sauclassroom.jpg` | 204 KB |
| `photos/saulogo.png` | 113 KB |

No responsive `srcset`, no lazy loading for below-the-fold images, and no modern WebP/AVIF alternatives are used.

- **Location:** [index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/index.html) and [photos/](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/photos/)
- **Problem:** Large images may increase initial load and bandwidth.
- **Recommended solution:** Resize and compress images, create WebP/AVIF variants, add `srcset`, and use `loading="lazy"` below the fold.

### 11.3 External resources

Google Fonts is loaded from Google Fonts, and the student portal loads an external logo from `successphd.com`.

- **Location:** All HTML pages for fonts; [student-portal/index.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/student-portal/index.html) for the external logo.
- **Problem:** External requests can delay rendering or fail independently of the main project.
- **Recommended solution:** Host approved fonts/assets locally or retain only the minimum font weights needed.
- **Priority:** **MEDIUM**

### 11.4 Script loading

[src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js) is loaded with no `defer` attribute, although it appears at the bottom of pages. It is relatively small source-wise but is loaded on every page. [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) is not included by the browser and is not tied to a package manifest.

### 8.5 Accessibility basics

Positive observations:

- Viewport metadata exists.
- Primary forms have labels or `aria-label` attributes.
- The help bot has `aria-expanded`, `aria-label`, and `aria-live`.
- Reduced-motion styles exist for major animations.
- Keyboard focus styles exist in several programme/detail and admissions sections.

Missing areas:

- No skip-to-content link was found.
- Focus-visible styling is not globally standardized.
- The filter radio inputs are visually hidden but are paired with labels.
- No automated accessibility audit was completed.
- Several `href="#"` links are not meaningful.

---

## 12. Security Review

### 12.1 Exposed credentials

No private keys or Supabase secret keys were found. No `.env` file is present in the inspected project.

### 12.2 Password handling

The Express backend uses bcrypt with 10 salt rounds and strips `passwordHash` from the login result.

However, the frontend sends passwords to a local HTTP endpoint, and no secure production authentication/session mechanism is implemented.

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js), [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)
- **Recommended solution:** HTTPS, secure cookies or signed tokens, CSRF protection, rate limiting, password reset, and server-side validation.
- **Priority:** **CRITICAL**

### 12.3 API exposure

Express has permissive CORS and no authentication middleware, rate limiting, security headers, or role/authorization checks.

- **Priority:** **CRITICAL**

### 12.4 SQL injection

No direct interpolation of request values appears in SQL strings. [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js) uses SQLite parameterized values.

### 12.5 Session handling

The frontend uses `sessionStorage` for `sau_signed_in` and `sau_applicant`, but sessionStorage is only a client-side flag and is not verification of authentication.

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)
- **Problem:** Anyone with access to the browser can change or remove sessionStorage values.
- **Why it matters:** It cannot protect applicant/profile data.
- **Recommended solution:** Do not treat sessionStorage as authorization. Validate every protected server route.
- **Priority:** **CRITICAL**

### 12.6 Third-party external logo

An external logo is loaded from a third-party domain. It may expose a page request/referrer but no secret data was observed.

---

## 13. Deployment Readiness

### 13.1 Relative paths

Local asset and HTML references resolve correctly for the tested static structure. The automated audit found 0 missing local references.

### 13.2 Case sensitivity

No filename mismatch was found in the existing local-link audit.

### 13.3 Static hosting compatibility

The project is broadly compatible with Netlify/Vercel static hosting if deployed as a static site, provided no backend routes or PHP/Express features are required. The README's static-host guidance is consistent with the HTML/CSS structure.

### 13.4 Backend deployment

Neither deployment platform is configured with a backend adapter. The Express server listens on port 3000 but has no package manifest or start script. The frontend expects PHP on `localhost:8000/api.php`. These are not compatible with a static-only deployment.

- **Location:** [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js), [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js), root project files
- **Problem:** Deployment configuration and application backend do not match.
- **Why it matters:** Apply/login can fail in production regardless of whether static pages deploy successfully.
- **Recommended solution:** Use one backend stack, provide serverless/server configuration, add a package manifest, and deploy the database with persistent storage or use a hosted database.
- **Priority:** **CRITICAL**

### 13.5 Missing assets and routing

- Profile route/page: missing
- PHP API file: missing
- Express package manifest: missing
- Supabase migration/policy files: missing
- Production environment configuration: missing
- 404/5xx custom pages: missing
- Robots/sitemap: missing

### 13.6 Absolute bot URLs

Bot links beginning with `/` can bypass relative static deployments. This is particularly relevant for preview URLs or subdirectory deployments.

- **Priority:** **MEDIUM**

---

## 14. Critical Issues

1. **[CRITICAL] Application form broken by field mismatch** — [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)  
   The submit handler expects password and confirm-password values that do not exist in the form.

2. **[CRITICAL] Programme preference cannot be selected** — [apply.html](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/apply.html), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)  
   The programme select remains disabled and no code populates it.

3. **[CRITICAL] Backend implementation is incomplete and inconsistent** — [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js), [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)  
   Frontend calls PHP endpoints while a separate Express server implements different routes, and neither stack is complete as deployed.

4. **[CRITICAL] Profile route/page missing** — [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)  
   Successful application and login redirect to `profile.html`, which does not exist.

5. **[CRITICAL] Authentication is not production-ready** — [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js), [src/script.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/script.js)  
   No secure session/token flow, protected profile route, password reset, or server-side authorization exists.

6. **[CRITICAL] Supabase integration absent** — Entire project  
   No client, database schema, notification integration, authentication, or RLS policies are present.

7. **[CRITICAL] Admin portal absent** — Entire project  
   No admin interface or authorization was found.

8. **[CRITICAL] Server-side validation absent** — [src/sever.js](/Users/izumi/Documents/WEB/SAU-Admissions-Portal/src/sever.js)  
   Direct API calls are not validated against allowed values or required fields.

---

## 15. Improvements Recommended

### High priority

- Complete and document one backend stack.
- Add server-side validation and secure authentication.
- Create the applicant profile/dashboard page and route guards.
- Implement forgot-password and help/support destinations.
- Replace notification placeholders with real notice URLs or document records.
- Add notification database/admin functionality.
- Restrict CORS and add HTTPS, rate limiting, security headers, and CSRF controls.
- Add database migrations and a package manifest.
- Add RLS policies if Supabase is adopted.

### Medium priority

- Add unique meta descriptions to all pages.
- Add canonical/Open Graph/Twitter metadata.
- Compress and convert images, add `srcset`, and lazy-load below-the-fold media.
- Replace external assets with approved local assets.
- Implement or remove placeholder dropdown/menu links.
- Implement or remove placeholder important-information cards.
- Fix help-bot root-relative links for subdirectory deployments.
- Standardize CSS breakpoints and consolidate duplicated CSS.
- Add a sitemap and robots file.
- Standardize header and footer markup across pages.

### Low priority

- Clean up misspelled/unclear file names and comments.
- Remove unused profile/dashboard CSS if no profile feature is implemented.
- Add a skip-to-content link.
- Improve consistent keyboard focus styling.
- Add automated HTML/CSS/JavaScript linting and link validation.

---

## 16. Missing Features

The following requested or implied features could not be found:

- Supabase database and client integration
- Supabase notification database
- Supabase/authentication implementation
- Supabase RLS policy files
- Real admin portal
- Applicant profile/dashboard page
- Working password registration or confirmation flow
- Dynamic programme selection
- Protected authenticated routes
- Password reset
- Database-backed notifications
- Notification detail/document pages
- Real search across programmes
- User role/authorization system
- Account logout
- Application fee/payment integration
- Document upload implementation
- Application-status timeline backed by database data
- Package/dependency manifest
- Deployment configuration
- Sitemap, robots, and social metadata

---

## 17. Final Project Status

### Current status

**The portal has a usable static visual foundation, but it is not production-ready as an admissions application.**

### Verified positives

- The 50 HTML pages exist and use a consistent overall visual system.
- All local file references checked by the automated link audit resolve.
- All reviewed images have `alt` attributes.
- No duplicate IDs were found within individual pages.
- Mobile browser testing at 375 px showed no document-level horizontal overflow.
- Notification search/category filtering source is implemented.
- The application/login layouts have labels and visible validation feedback structures.
- Password values are bcrypt-hashed in the Express backend and `passwordHash` is removed from login data.
- No private key or Supabase service-role key was found.

### Production blockers

- Application submission and login flows cannot complete with the current mismatched markup/backend.
- The profile route does not exist.
- No secure authentication/session system exists.
- No Supabase integration or RLS policies exist.
- No admin portal exists.
- No notification database exists.
- Server-side validation and production API configuration are incomplete.

### Overall priorities

1. **Fix the functional backend and application flow.**
2. **Implement secure authentication and protected applicant/admin routes.**
3. **Implement notifications and Supabase or an alternative documented database solution.**
4. **Complete metadata, asset optimization, placeholder destinations, and deployment configuration.**

Until these items are addressed, the project should be considered a **frontend prototype, not a production admissions portal**.
