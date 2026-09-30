# Meta Ads Portfolio

A one page portfolio for a Meta Ads (Facebook and Instagram) specialist. Plain HTML, CSS and JS, no build step. Hosted on GitHub Pages.

## Files

- `index.html` : all the content (hero, case studies, services, ad creatives, process, testimonials, contact)
- `styles.css` : design. Colours are at the top under `:root`
- `script.js` : menu, scroll animations, number counters, case study filter, contact form

## Things to replace before sharing

The site ships with sample content. Swap these for your real details:

1. Name and logo text (`steins.` in the nav and footer)
2. Hero stats and the dashboard card numbers
3. The six case studies (numbers, descriptions, categories in `data-cat`)
4. Ad creative mockups (brand names, copy)
5. Testimonials
6. Email and WhatsApp number in the contact section and in `script.js` (`910000000000`)

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
