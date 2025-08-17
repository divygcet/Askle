(function() {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navList = $('#primary-menu');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('is-open');
    });
  }

  // Work filters
  const filterButtons = $$('.filters .chip');
  const cards = $$('#workGrid .card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || filter === category;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Theme toggle
  const themeToggle = $('#themeToggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) document.documentElement.dataset.theme = storedTheme;
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
    });
  }

  // Minimal light theme support via CSS vars override
  const style = document.createElement('style');
  style.textContent = `
    :root[data-theme="light"] { color-scheme: light; }
    :root[data-theme="light"] body { background: #ffffff; color: #111827; }
    :root[data-theme="light"] .site-header, :root[data-theme="light"] .form, :root[data-theme="light"] .card, :root[data-theme="light"] .service, :root[data-theme="light"] .quote, :root[data-theme="light"] .about-aside {
      background: #ffffff !important; border-color: #e5e7eb !important; color: #111827 !important;
    }
    :root[data-theme="light"] .btn-secondary, :root[data-theme="light"] .icon-btn { background: #ffffff; border-color: #e5e7eb; color: #111827; }
    :root[data-theme="light"] .btn-ghost { border-color: #e5e7eb; color: #374151; }
    :root[data-theme="light"] .overline, :root[data-theme="light"] .muted { color: #6b7280; }
  `;
  document.head.appendChild(style);

  // Contact form
  const form = $('#contactForm');
  const status = $('#formStatus');
  function encodeQuery(params) {
    return Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  }
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      const data = Object.fromEntries(new FormData(form).entries());
      const endpoint = form.dataset.formEndpoint;
      const subject = `Inquiry: ${data.type || 'Project'}`;
      const body = `Name: ${data.name}\nEmail: ${data.email}\nType: ${data.type}\nBudget: ${data.budget}\n\n${data.message}`;
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error('Failed');
          status.textContent = 'Thank you! I\'ll be in touch shortly.';
          status.style.color = 'var(--success)';
          form.reset();
        } else {
          window.location.href = `mailto:alex@yourdomain.com?${encodeQuery({ subject, body })}`;
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email me directly.';
        status.style.color = 'var(--danger)';
      }
    });
  }

  // Copy email helper
  const copyBtn = $('#copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email || 'alex@yourdomain.com';
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1400);
      } catch (_) {
        // no-op
      }
    });
  }

  // Active section highlighting
  const navLinks = $$('.nav-list a');
  const sections = ['work', 'about', 'services', 'publications', 'testimonials', 'process', 'contact'].map(id => ({ id, el: document.getElementById(id) })).filter(s => s.el);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
  sections.forEach(s => io.observe(s.el));

  // Footer year
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(year);
})();