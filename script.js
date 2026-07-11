// ===== Nimbark Research Insights — site interactions =====

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close the mobile menu when a link is clicked
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Highlight the nav link for the section currently in view
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => observer.observe(section));

// Contact form → opens WhatsApp with a pre-filled message (no backend needed)
const WHATSAPP_NUMBER = '919996667152';

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  const lines = [
    'Hello Nimbark Research Insights,',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    service ? `Service Required: ${service}` : null,
    '',
    `Message: ${message}`,
  ].filter((line) => line !== null);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener');
});
