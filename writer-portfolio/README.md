# Writer Portfolio (Dark Theme)

A static, dark-themed professional writer portfolio with sections for work, about, services, publications, testimonials, process, and contact. Includes sample writing pieces.

## Getting started

- Open `index.html` in your browser, or run a simple server:

```bash
python3 -m http.server 5173 --directory /workspace/writer-portfolio
```

Then visit `http://localhost:5173`.

## Customize

- Replace the name and details in `index.html`
- Update social links in the footer
- Swap the email in Contact and `assets/script.js`
- Edit styles in `assets/styles.css` (colors and spacing use CSS variables)
- Add or replace samples in `content/` and update the cards in the Work section
- If you use a form service (e.g., Formspree), set `data-form-endpoint` on the form

## Deploy

Host on any static host (GitHub Pages, Netlify, Vercel, etc.).