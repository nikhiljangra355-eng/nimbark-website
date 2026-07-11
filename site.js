// =====================================================
// Nimbark Research Insights — shared layout + behaviour
// Injects header / footer / modal / floating actions on
// every page, and wires up all site interactions.
// =====================================================

(function () {
  'use strict';

  var WHATSAPP = '919996667152';
  var PHONE_DISPLAY = '95881-42496';
  var PHONE_TEL = '+919588142496';
  var EMAIL = 'info@nimbarkinsights.com';
  var MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('#1639/12, Ground Floor, Opp. 3rd Gate KUK, Kurukshetra, Haryana');

  var SERVICES = [
    { slug: 'phd-thesis', name: 'PhD Thesis Assistance' },
    { slug: 'synopsis-research-paper', name: 'Synopsis & Research Paper Writing' },
    { slug: 'data-analysis', name: 'Data Analysis & Interpretation' },
    { slug: 'journal-publication', name: 'Journal Publication Support' },
    { slug: 'plagiarism-removal', name: 'Plagiarism Removal & Plagiarism Report' },
    { slug: 'editing-proofreading', name: 'Academic Editing & Proofreading' },
    { slug: 'book-publishing', name: 'Book Publishing' },
    { slug: 'patent-copyright', name: 'Patent & Copyright Assistance' },
    { slug: 'project-internship-reports', name: 'Project & Internship Reports' }
  ];

  var ICON = {
    phone: '<svg viewBox="0 0 24 24" class="icon-xs"><path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" class="icon-xs"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" class="icon-xs"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.38 4.63zM12.05 2A11.86 11.86 0 0 0 1.8 19.8L.1 24l4.3-1.13A11.85 11.85 0 1 0 12.05 2z"/></svg>'
  };

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // ---------- Header ----------
  function buildHeader() {
    var dropdownLinks = SERVICES.map(function (s) {
      return '<a href="/services/' + s.slug + '">' + s.name + '</a>';
    }).join('') + '<a href="/services" class="dropdown-all">View All Services →</a>';

    var header = el(
      '<div>' +
      '<div class="topbar"><div class="container topbar-inner">' +
        '<div class="topbar-left">' +
          '<a href="tel:' + PHONE_TEL + '" class="topbar-item">' + ICON.phone + PHONE_DISPLAY + '</a>' +
          '<a href="mailto:' + EMAIL + '" class="topbar-item">' + ICON.mail + EMAIL + '</a>' +
        '</div>' +
        '<div class="topbar-right"><a href="' + MAPS_URL + '" target="_blank" rel="noopener" class="topbar-item">' + ICON.pin + 'Opp. 3rd Gate KUK, Kurukshetra</a></div>' +
      '</div></div>' +
      '<header class="header"><div class="container header-inner">' +
        '<a href="/" class="brand brand-badge" aria-label="Nimbark Research Insights — home">' +
          '<span class="brand-top">' +
            '<img src="/assets/logo.png" alt="Nimbark Research Insights logo" class="brand-logo" width="42" height="42" />' +
            '<span class="brand-text"><span class="brand-name">NIMBARK</span><span class="brand-sub">RESEARCH INSIGHTS</span></span>' +
          '</span>' +
          '<span class="brand-tagline">Searching &amp; Researching for Knowledge</span>' +
        '</a>' +
        '<nav class="nav" id="nav" aria-label="Main navigation">' +
          '<a href="/" class="nav-link" data-nav="home">Home</a>' +
          '<a href="/about" class="nav-link" data-nav="about">About</a>' +
          '<div class="has-dropdown" id="servicesDropdown">' +
            '<a href="/services" class="nav-link" data-nav="services" aria-haspopup="true">Services <svg viewBox="0 0 24 24" class="icon-xs caret"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></a>' +
            '<div class="dropdown">' + dropdownLinks + '</div>' +
          '</div>' +
          '<a href="/resources" class="nav-link" data-nav="resources">Resources</a>' +
          '<a href="/faq" class="nav-link" data-nav="faq">FAQ</a>' +
          '<a href="/contact" class="nav-link" data-nav="contact">Contact</a>' +
          '<button type="button" class="btn btn-primary nav-cta" data-open-modal>Get Free Consultation</button>' +
        '</nav>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></header></div>'
    );
    document.body.insertBefore(header, document.body.firstChild);
  }

  // ---------- Footer ----------
  function buildFooter() {
    var serviceLinks = SERVICES.slice(0, 6).map(function (s) {
      return '<a href="/services/' + s.slug + '">' + s.name + '</a>';
    }).join('');

    var footer = el(
      '<footer class="footer">' +
      '<div class="container footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="/" class="brand brand-badge">' +
            '<span class="brand-top">' +
              '<img src="/assets/logo.png" alt="Nimbark Research Insights logo" class="brand-logo" width="42" height="42" />' +
              '<span class="brand-text"><span class="brand-name">NIMBARK</span><span class="brand-sub">RESEARCH INSIGHTS</span></span>' +
            '</span>' +
            '<span class="brand-tagline">Searching &amp; Researching for Knowledge</span>' +
          '</a>' +
          '<p>A trusted global platform for academic excellence, ethical publishing, and impactful research dissemination.</p>' +
        '</div>' +
        '<div class="footer-col"><h4>Quick Links</h4>' +
          '<a href="/">Home</a><a href="/about">About Us</a><a href="/services">Services</a>' +
          '<a href="/resources">Resources</a><a href="/faq">FAQ</a><a href="/contact">Contact</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Our Services</h4>' + serviceLinks + '</div>' +
        '<div class="footer-col"><h4>Contact</h4>' +
          '<a href="tel:' + PHONE_TEL + '">Call: ' + PHONE_DISPLAY + '</a>' +
          '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp: 99966-67152</a>' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
          '<a href="' + MAPS_URL + '" target="_blank" rel="noopener">#1639/12, Ground Floor,<br/>Opp. 3rd Gate KUK, Kurukshetra,<br/>Haryana, India</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom"><div class="container"><p>© <span id="year"></span> Nimbark Research Insights. All rights reserved.</p></div></div>' +
      '</footer>'
    );
    document.body.appendChild(footer);
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  // ---------- Floating WhatsApp + mobile bottom bar ----------
  function buildFloaters() {
    document.body.appendChild(el(
      '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" class="wa-float" aria-label="Chat on WhatsApp">' + ICON.wa + '</a>'
    ));
    document.body.appendChild(el(
      '<div class="bottom-bar">' +
        '<a href="tel:' + PHONE_TEL + '" class="bb-call"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/></svg>Call</a>' +
        '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" class="bb-wa">' + ICON.wa + 'WhatsApp</a>' +
        '<button type="button" class="bb-enquire" data-open-modal><svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>Enquire</button>' +
      '</div>'
    ));
  }

  // ---------- Consultation modal ----------
  function buildModal() {
    var options = SERVICES.map(function (s) {
      return '<option value="' + s.name + '">' + s.name + '</option>';
    }).join('');

    var overlay = el(
      '<div class="modal-overlay" id="consultModal" role="dialog" aria-modal="true" aria-labelledby="consultTitle">' +
      '<div class="modal">' +
        '<button type="button" class="modal-close" aria-label="Close">✕</button>' +
        '<h2 id="consultTitle">Get a Free Consultation</h2>' +
        '<p>Share your details and our research advisor will call you back within 24 hours. 100% confidential.</p>' +
        '<form class="enquiry-form" data-enquiry-form>' +
          '<div class="form-feedback" role="alert"></div>' +
          '<div class="hp-field" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>' +
          '<div class="form-group"><label>Full Name *<input type="text" name="name" placeholder="Your name" required /></label></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label>Phone Number *<input type="tel" name="phone" placeholder="10-digit mobile number" required /></label></div>' +
            '<div class="form-group"><label>Email *<input type="email" name="email" placeholder="you@example.com" required /></label></div>' +
          '</div>' +
          '<div class="form-group"><label>Service Required<select name="service"><option value="">— Select a service —</option>' + options + '<option value="Other">Other</option></select></label></div>' +
          '<div class="form-group"><label>Your Message<textarea name="message" rows="3" placeholder="Tell us briefly about your requirement…"></textarea></label></div>' +
          '<button type="submit" class="btn btn-primary btn-block">Request Callback</button>' +
          '<p class="form-note">We never share your details with anyone. NDA available on request.</p>' +
        '</form>' +
      '</div></div>'
    );
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.modal-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-open-modal]');
      if (!btn) return;
      e.preventDefault();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      var first = overlay.querySelector('input[name="name"]');
      if (first) setTimeout(function () { first.focus(); }, 60);
    });
  }

  // ---------- Mobile nav ----------
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      var dd = document.getElementById('servicesDropdown');
      // On mobile, first tap on "Services" opens the submenu instead of navigating
      if (window.innerWidth <= 760 && e.target.closest('[data-nav="services"]') && !dd.classList.contains('open')) {
        e.preventDefault();
        dd.classList.add('open');
        return;
      }
      if (e.target.closest('a') || e.target.closest('[data-open-modal]')) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Active link highlighting from URL
    var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    var key = 'home';
    if (path.indexOf('/about') === 0) key = 'about';
    else if (path.indexOf('/services') === 0) key = 'services';
    else if (path.indexOf('/resources') === 0) key = 'resources';
    else if (path.indexOf('/faq') === 0) key = 'faq';
    else if (path.indexOf('/contact') === 0) key = 'contact';
    var active = nav.querySelector('[data-nav="' + key + '"]');
    if (active && path !== '/') active.classList.add('active');
    else if (path === '/') nav.querySelector('[data-nav="home"]').classList.add('active');
  }

  // ---------- Enquiry forms (modal + contact page) ----------
  function initForms() {
    document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var feedback = form.querySelector('.form-feedback');
        var button = form.querySelector('button[type="submit"]');
        var original = button.innerHTML;

        // Use form.elements — form.name would return the <form>'s own name attribute
        var f = form.elements;
        var payload = {
          name: f.namedItem('name').value.trim(),
          email: f.namedItem('email').value.trim(),
          phone: f.namedItem('phone').value.trim(),
          service: f.namedItem('service') ? f.namedItem('service').value : '',
          message: f.namedItem('message') ? f.namedItem('message').value.trim() : '',
          website: f.namedItem('website') ? f.namedItem('website').value : ''
        };

        feedback.className = 'form-feedback';
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Sending…';

        // If the API can't take the enquiry for any reason, never lose the
        // lead — offer a one-click WhatsApp message with the same details.
        function showError(message) {
          var lines = [
            'Hello Nimbark Research Insights,', '',
            'Name: ' + payload.name,
            'Phone: ' + payload.phone,
            'Email: ' + payload.email,
            payload.service ? 'Service Required: ' + payload.service : '',
            payload.message ? 'Message: ' + payload.message : ''
          ].filter(Boolean).join('\n');
          var waUrl = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines);
          feedback.className = 'form-feedback error';
          feedback.textContent = message + ' ';
          var link = document.createElement('a');
          link.href = waUrl;
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = 'Send your enquiry on WhatsApp instead →';
          link.style.fontWeight = '700';
          link.style.textDecoration = 'underline';
          feedback.appendChild(link);
        }

        fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            // Parse defensively: platform error pages may return non-JSON
            return res.text().then(function (text) {
              var data = null;
              try { data = JSON.parse(text); } catch (err) { /* non-JSON response */ }
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (result.ok && result.data && result.data.success) {
              feedback.className = 'form-feedback success';
              feedback.textContent = 'Thank you, ' + payload.name.split(' ')[0] +
                '! Your enquiry has been received. Our team will contact you within 24 hours.';
              form.reset();
            } else {
              showError((result.data && result.data.error) ||
                'Something went wrong on our side.');
            }
          })
          .catch(function () {
            showError('Network error — please check your connection.');
          })
          .finally(function () {
            button.disabled = false;
            button.innerHTML = original;
            feedback.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          });
      });
    });
  }

  // ---------- Animated counters ----------
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        var node = entry.target;
        var target = parseInt(node.getAttribute('data-count'), 10);
        var duration = 1600;
        var start = null;
        function tick(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = Math.round(target * eased).toLocaleString('en-IN');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  // ---------- Testimonials carousel ----------
  function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;
    var slides = carousel.querySelector('.carousel-slides');
    var items = slides.children.length;
    var dotsWrap = carousel.parentElement.querySelector('.carousel-dots');
    var index = 0;
    var timer = null;

    for (var i = 0; i < items; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      (function (n) { dot.addEventListener('click', function () { go(n); restart(); }); })(i);
      dotsWrap.appendChild(dot);
    }

    function go(n) {
      index = (n + items) % items;
      slides.style.transform = 'translateX(-' + index * 100 + '%)';
      dotsWrap.querySelectorAll('button').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 5500);
    }

    carousel.querySelector('.prev').addEventListener('click', function () { go(index - 1); restart(); });
    carousel.querySelector('.next').addEventListener('click', function () { go(index + 1); restart(); });
    go(0);
    restart();
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  // ---------- Boot ----------
  function boot() {
    buildHeader();
    buildFooter();
    buildFloaters();
    buildModal();
    initNav();
    initForms();
    initCounters();
    initCarousel();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
