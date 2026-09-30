# Meta Ads Portfolio

A professional one page portfolio for a performance marketer (Meta Ads), built for job applications. Plain HTML, CSS and JS, no build step. Hosted on GitHub Pages.

- Main site (professional): `/`
- Bold agency-style version: `/bold/`

## Files

- `index.html` : all the content (hero, about, experience, case studies, skills, planner, certifications, recommendations, contact)
- `styles.css` : design. Colours are at the top under `:root`
- `script.js` : menu, scroll animations, number counters, case study filter, contact form

## Things to replace before sharing

The site ships with sample content. Swap these for your real details:

1. Experience timeline: job titles, dates, the second company and your college
2. Stats and case study numbers: use your real results
3. Certifications: keep only the ones you actually hold
4. Recommendations: real names and quotes (in `script.js`, `quotes`)
5. Email, LinkedIn and phone in the contact section, and the email in `script.js`
6. Add your CV as `resume.pdf` in this folder. Until then the CV buttons scroll to Contact

## Run locally

Just open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

## Publish changes

```
git add .
git commit -m "Update content"
git push
```

GitHub Pages redeploys in about a minute.
