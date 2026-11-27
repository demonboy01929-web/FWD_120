# SAU Admissions Portal
A static frontend admissions portal for South Asian University.

## Project structure

- `index.html` - main admissions homepage
- `admissions.html` - admissions overview
- `apply.html` - application form
- `notifications.html` - admission notices and filters
- `student-portal/` - student login interface
- `programmes/` - Bachelor, Master, and PhD programme pages
- `photos/` - local image assets
- `style/style.css` - shared stylesheet
- `src/script.js` - frontend behaviour
- `src/sever.js` - experimental Express/SQLite backend

## Running locally

Open `index.html` directly in a browser, or serve the project with a static HTTP server:

Then visit `http://localhost:4173/index.html`.

## Deployment

The HTML, CSS, and JavaScript can be deployed to a static host such as Netlify or Vercel. The project root may be used as the deployment directory.

The separate PHP and Express integration code is not currently complete or production-configured. Before enabling applications or login, complete one backend implementation, configure its database and authentication securely, and add the missing profile/dashboard route.

## Review

A detailed, section-by-section project review is available in [WEBSITE_REVIEW.md](./WEBSITE_REVIEW.md).
