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
  // Query resolves to the Gate No. 3 landmark of Kurukshetra University —
  // the office is directly opposite it, so navigation lands at the right spot.
  var MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Gate No. 3, Kurukshetra University, Kurukshetra, Haryana 136119');
  // Social profiles — leave a value empty ('') to hide that icon until the
  // account exists. Fill in the real link and the icon appears automatically.
  var SOCIAL = {
    facebook: 'https://www.facebook.com/profile.php?id=61592094057940',
    instagram: 'https://www.instagram.com/nimbarkinsights',
    youtube: ''
  };
  // Google Analytics 4 measurement ID (e.g. 'G-XXXXXXXXXX').
  // Leave empty to keep analytics off; set it and every page starts tracking.
  var GA_ID = 'G-0JYW4NTTGE';

  function initAnalytics() {
    if (!GA_ID) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Core services — the one list every menu, footer and form uses
  var SERVICES = [
    { slug: 'phd-thesis', name: 'Ph.D Thesis & Dissertation Support' },
    { slug: 'synopsis-research-paper', name: 'Research Paper & Synopsis Writing Support' },
    { slug: 'data-analysis', name: 'Data Analysis & Interpretation (SPSS, AMOS, etc.) Support' },
    { slug: 'journal-publication', name: 'Journal Publication Support — UGC‑CARE, Scopus, SCI, Web of Science' },
    { slug: 'plagiarism-removal', name: 'Plagiarism Removal & Turnitin Report' },
    { slug: 'editing-proofreading', name: 'Academic Editing & Proofreading' },
    { slug: 'book-publishing', name: 'Book Publishing, Patent & Copyright Filing Support' },
    { slug: 'project-internship-reports', name: 'Project, Internship & Assignment Support' }
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
          '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" class="topbar-item topbar-waicon" aria-label="WhatsApp on 99966-67152" title="WhatsApp on 99966-67152"><svg viewBox="0 0 24 24" class="icon-xs"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.38 4.63zM12.05 2A11.86 11.86 0 0 0 1.8 19.8L.1 24l4.3-1.13A11.85 11.85 0 1 0 12.05 2z"/></svg></a>' +
          '<a href="tel:+919996667152" class="topbar-item topbar-num2">' + ICON.phone + '99966-67152</a>' +
          '<a href="mailto:' + EMAIL + '" class="topbar-item">' + ICON.mail + EMAIL + '</a>' +
        '</div>' +
        '<div class="topbar-right topbar-social">' +
          (SOCIAL.facebook ? '<a href="' + SOCIAL.facebook + '" target="_blank" rel="noopener" class="soc soc-fb" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 22v-8.1h2.9l.5-3.7h-3.4V7.9c0-1 .3-1.8 1.9-1.8h1.6V2.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v2.9H7v3.7h3V22z"/></svg></a>' : '') +
          (SOCIAL.instagram ? '<a href="' + SOCIAL.instagram + '" target="_blank" rel="noopener" class="soc soc-ig" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 5a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 1.8a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5-3.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"/></svg></a>' : '') +
          (SOCIAL.youtube ? '<a href="' + SOCIAL.youtube + '" target="_blank" rel="noopener" class="soc soc-yt" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12z"/></svg></a>' : '') +
          '<a href="' + MAPS_URL + '" target="_blank" rel="noopener" class="soc soc-map" aria-label="Find us on Google Maps">' +
            '<svg viewBox="0 0 24 24"><defs><clipPath id="mpin"><path d="M12 1.8a7.2 7.2 0 0 0-7.2 7.2c0 5.4 7.2 13.2 7.2 13.2s7.2-7.8 7.2-13.2A7.2 7.2 0 0 0 12 1.8z"/></clipPath></defs>' +
            '<g clip-path="url(#mpin)">' +
              '<rect x="0" y="0" width="12" height="9" fill="#4285f4"/>' +
              '<rect x="12" y="0" width="12" height="9" fill="#34a853"/>' +
              '<rect x="0" y="9" width="12" height="15" fill="#fbbc04"/>' +
              '<rect x="12" y="9" width="12" height="15" fill="#ea4335"/>' +
              '<circle cx="12" cy="9" r="2.7" fill="#ffffff"/>' +
            '</g></svg><span>Maps</span></a>' +
        '</div>' +
      '</div></div>' +
      '<header class="header"><div class="container header-inner">' +
        '<a href="/" class="brand-img" aria-label="Nimbark Research Insights — home">' +
        '<svg class="brand-svg" viewBox="0 0 380 100" role="img" aria-label="Nimbark Research Insights — Searching & Researching for Knowledge">' +
        '<defs><clipPath id="bcorn"><rect x="2" y="2" width="376" height="96" rx="16"/></clipPath></defs>' +
        '<g clip-path="url(#bcorn)">' +
          '<rect x="0" y="0" width="380" height="100" fill="#ffffff"/>' +
          '<rect x="0" y="70" width="380" height="30" fill="#f5921e"/>' +
          '<image href="/assets/logo.png" x="8" y="5" width="62" height="62"/>' +
          '<text x="78" y="47" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="52" fill="#2d6a30" textLength="290" lengthAdjust="spacing">NIMBARK</text>' +
          '<text x="78" y="65" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="20" fill="#2d6a30" textLength="290" lengthAdjust="spacing">RESEARCH INSIGHTS</text>' +
          '<text x="190" y="91" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="14" fill="#ffffff" textLength="348" lengthAdjust="spacing">SEARCHING &amp; RESEARCHING FOR KNOWLEDGE</text>' +
        '</g>' +
        '<rect x="2" y="2" width="376" height="96" rx="16" fill="none" stroke="#f5921e" stroke-width="4"/>' +
      '</svg>' +
        '</a>' +
        '<nav class="nav" id="nav" aria-label="Main navigation">' +
          '<a href="/" class="nav-link" data-nav="home">Home</a>' +
          '<a href="/about" class="nav-link" data-nav="about">About Us</a>' +
          '<div class="has-dropdown" id="servicesDropdown">' +
            '<a href="/services" class="nav-link" data-nav="services" aria-haspopup="true">Services <svg viewBox="0 0 24 24" class="icon-xs caret"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></a>' +
            '<div class="dropdown">' + dropdownLinks + '</div>' +
          '</div>' +
          '<a href="/#how-it-works" class="nav-link">How It Works</a>' +
          '<a href="/#journal-publications" class="nav-link">Journal Publications</a>' +
          '<a href="/#testimonials" class="nav-link">Testimonials</a>' +
          '<a href="/faq" class="nav-link" data-nav="faq">FAQ</a>' +
          '<a href="/contact" class="nav-link" data-nav="contact">Contact Us</a>' +
          '<button type="button" class="btn btn-primary nav-cta" data-open-modal>Get Free Consultation</button>' +
        '</nav>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></header></div>'
    );
    document.body.insertBefore(header, document.body.firstChild);
  }

  // ---------- Footer ----------
  function buildFooter() {
    var serviceLinks = SERVICES.map(function (s) {
      return '<a href="/services/' + s.slug + '">' + s.name + '</a>';
    }).join('');

    var footer = el(
      '<footer class="footer">' +
      '<div class="container footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="/" class="brand-img">' +
          '<svg class="brand-svg" viewBox="0 0 380 100" role="img" aria-label="Nimbark Research Insights — Searching & Researching for Knowledge">' +
        '<defs><clipPath id="bcornf"><rect x="2" y="2" width="376" height="96" rx="16"/></clipPath></defs>' +
        '<g clip-path="url(#bcornf)">' +
          '<rect x="0" y="0" width="380" height="100" fill="#ffffff"/>' +
          '<rect x="0" y="70" width="380" height="30" fill="#f5921e"/>' +
          '<image href="/assets/logo.png" x="8" y="5" width="62" height="62"/>' +
          '<text x="78" y="47" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="52" fill="#2d6a30" textLength="290" lengthAdjust="spacing">NIMBARK</text>' +
          '<text x="78" y="65" font-family="Poppins, Arial, sans-serif" font-weight="800" font-size="20" fill="#2d6a30" textLength="290" lengthAdjust="spacing">RESEARCH INSIGHTS</text>' +
          '<text x="190" y="91" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="14" fill="#ffffff" textLength="348" lengthAdjust="spacing">SEARCHING &amp; RESEARCHING FOR KNOWLEDGE</text>' +
        '</g>' +
        '<rect x="2" y="2" width="376" height="96" rx="16" fill="none" stroke="#f5921e" stroke-width="4"/>' +
      '</svg>' +
          '</a>' +
          '<p>A trusted global platform for academic excellence, ethical publishing, and impactful research dissemination.</p>' +
        '</div>' +
        '<div class="footer-col"><h4>Quick Links</h4>' +
          '<a href="/">Home</a><a href="/about">About Us</a><a href="/services">Services</a>' +
          '<a href="/#how-it-works">How It Works</a><a href="/#journal-publications">Journal Publications</a>' +
          '<a href="/#testimonials">Testimonials</a>' +
          '<a href="/faq">FAQ</a><a href="/contact">Contact Us</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Our Services</h4>' + serviceLinks + '</div>' +
        '<div class="footer-col"><h4>Contact Us</h4>' +
          '<a href="tel:' + PHONE_TEL + '" class="foot-row"><span class="fr-ic fr-call">' + ICON.phone + '</span><span>' + PHONE_DISPLAY + '</span></a>' +
          '<div class="foot-row foot-num">' +
            '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" class="fr-ic fr-wa" aria-label="WhatsApp on 99966-67152" title="WhatsApp on 99966-67152"><svg viewBox="0 0 24 24" class="icon-xs"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.38 4.63zM12.05 2A11.86 11.86 0 0 0 1.8 19.8L.1 24l4.3-1.13A11.85 11.85 0 1 0 12.05 2z"/></svg></a>' +
            '<a href="tel:+919996667152">99966-67152</a>' +
          '</div>' +
          '<a href="mailto:' + EMAIL + '" class="foot-row"><span class="fr-ic fr-mail">' + ICON.mail + '</span><span>' + EMAIL + '</span></a>' +
          '<a href="' + MAPS_URL + '" target="_blank" rel="noopener" class="foot-row foot-addr"><span class="fr-ic fr-pin">' + ICON.pin + '</span><span>#1640/12, Opp. 3rd Gate Kurukshetra University, Kurukshetra, Haryana, India</span></a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom"><div class="container"><p>© <span id="year"></span> Nimbark Research Insights. All rights reserved. · <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a></p></div></div>' +
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

  // ---------- Scroll progress bar + back-to-top ----------
  function initScrollExtras() {
    var bar = el('<div class="scroll-progress" aria-hidden="true"></div>');
    document.body.appendChild(bar);

    var topBtn = el(
      '<button type="button" class="back-top" aria-label="Back to top">' +
      '<svg viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>' +
      '</button>'
    );
    document.body.appendChild(topBtn);
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        topBtn.classList.toggle('show', window.scrollY > 600);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Consultation modal ----------
  var EXTRA_OPTIONS = [
    'Specific Chapter Help',
    'Literature Review',
    'Research Methodology',
    'Implementation Code (Python / MATLAB)',
    'Conference Paper'
  ];

  function buildModal() {
    var options = SERVICES.map(function (s) {
      return '<option value="' + s.name + '">' + s.name + '</option>';
    }).join('');
    var extraOptions = EXTRA_OPTIONS.map(function (name) {
      return '<option value="' + name + '">' + name + '</option>';
    }).join('');

    var overlay = el(
      '<div class="modal-overlay" id="consultModal" role="dialog" aria-modal="true" aria-labelledby="consultTitle">' +
      '<div class="modal">' +
        '<button type="button" class="modal-close" aria-label="Close">✕</button>' +
        '<h2 id="consultTitle">Get Free Expert Consultation</h2>' +
        '<p>Fill your details — our research expert will call you back. 100% confidential.</p>' +
        '<form class="enquiry-form" data-enquiry-form>' +
          '<div class="form-feedback" role="alert"></div>' +
          '<div class="hp-field" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>' +
          '<div class="form-group"><label>Your Name *<input type="text" name="name" placeholder="Dr. Sharma" required /></label></div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label>Phone *<input type="tel" name="phone" placeholder="+91 98765 43210" required /></label></div>' +
            '<div class="form-group"><label>Email *<input type="email" name="email" placeholder="you@uni.ac.in" required /></label></div>' +
          '</div>' +
          '<div class="form-group"><label>Service Required *<select name="service" required><option value="">— Select Your Requirement —</option>' +
            '<optgroup label="Our Services">' + options + '</optgroup>' +
            '<optgroup label="Specific Requirements">' + extraOptions + '</optgroup>' +
            '<option value="Other">Other</option></select></label></div>' +
          '<div class="form-group"><label>Research Area / Brief Requirement<textarea name="message" rows="3" placeholder="E.g. Management — consumer behaviour thesis help…"></textarea></label></div>' +
          '<button type="submit" class="btn btn-primary btn-block">Request Free Callback →</button>' +
          '<p class="form-note">We never share your details with anyone. NDA available on request.</p>' +
        '</form>' +
        '<div class="modal-quick">' +
          '<p class="mq-title">Prefer to reach us directly?</p>' +
          '<div class="mq-btns">' +
            '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" class="mq-btn mq-wa">' + ICON.wa + 'WhatsApp Now</a>' +
            '<a href="tel:' + PHONE_TEL + '" class="mq-btn mq-call">' + ICON.phone + 'Call Now</a>' +
          '</div>' +
          '<p class="mq-info"><a href="mailto:' + EMAIL + '">' + EMAIL + '</a><span> · </span><a href="' + MAPS_URL + '" target="_blank" rel="noopener">#1640/12, Opp. 3rd Gate Kurukshetra University, Kurukshetra</a></p>' +
        '</div>' +
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
      // On a service page, pre-select that service in the form
      var match = location.pathname.match(/^\/services\/([a-z-]+)/);
      if (match) {
        var slug = match[1] === 'patent-copyright' ? 'book-publishing' : match[1];
        var svc = SERVICES.filter(function (s) { return s.slug === slug; })[0];
        var select = overlay.querySelector('select[name="service"]');
        if (svc && select) select.value = svc.name;
      }
      var first = overlay.querySelector('input[name="name"]');
      if (first) setTimeout(function () { first.focus(); }, 60);
    });
  }

  // ---------- Mobile nav ----------
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    var dim = el('<div class="nav-overlay" aria-hidden="true"></div>');
    document.body.appendChild(dim);

    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      dim.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    dim.addEventListener('click', function () { setOpen(false); });
    nav.addEventListener('click', function (e) {
      var dd = document.getElementById('servicesDropdown');
      // On mobile, first tap on "Services" opens the submenu instead of navigating
      if (window.innerWidth <= 760 && e.target.closest('[data-nav="services"]') && !dd.classList.contains('open')) {
        e.preventDefault();
        dd.classList.add('open');
        return;
      }
      if (e.target.closest('a') || e.target.closest('[data-open-modal]')) {
        setOpen(false);
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
  // ---------- Testimonials auto-slider ----------
  function initReviews() {
    var viewport = document.querySelector('.reviews-viewport');
    if (!viewport) return;
    var track = viewport.querySelector('.reviews-track');
    var cards = track.children;
    var dotsWrap = document.querySelector('.rev-dots');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index = 0;
    var timer = null;

    function visibleCount() {
      var w = window.innerWidth;
      return w <= 560 ? 1 : w <= 800 ? 2 : w <= 1100 ? 3 : 4;
    }
    function maxIndex() {
      return Math.max(0, cards.length - visibleCount());
    }
    function update() {
      if (index > maxIndex()) index = 0;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var step = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * step) + 'px)';
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, k) {
          d.classList.toggle('on', k === index);
        });
      }
    }
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        (function (i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Show reviews page ' + (i + 1));
          b.addEventListener('click', function () { index = i; update(); restart(); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }
    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(next, 1500);
    }
    viewport.addEventListener('mouseenter', function () { clearInterval(timer); });
    viewport.addEventListener('mouseleave', restart);
    window.addEventListener('resize', function () { buildDots(); update(); });
    buildDots();
    update();
    restart();
  }

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

    // Touch swipe on mobile
    var startX = null;
    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) {
        go(delta < 0 ? index + 1 : index - 1);
        restart();
      }
      startX = null;
    }, { passive: true });

    go(0);
    restart();
  }

  // ---------- Hero rotating services line ----------
  function initRotator() {
    var node = document.getElementById('heroRotator');
    if (!node) return;
    var words = [
      'PhD Thesis Writing',
      'Synopsis & Research Papers',
      'SPSS · AMOS · R Data Analysis',
      'UGC-CARE & Scopus Publication',
      'Plagiarism Removal',
      'Editing & Proofreading',
      'Book Publishing with ISBN',
      'Patent & Copyright Filing'
    ];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      node.style.animation = 'none';
      // Force reflow so the entry animation replays
      void node.offsetWidth;
      node.textContent = words[i];
      node.style.animation = '';
    }, 2600);
  }

  // ---------- Hero story (3-scene loop) ----------
  function initStory() {
    var story = document.getElementById('heroStory');
    if (!story) return;
    var scenes = [].slice.call(story.querySelectorAll('.story-scene'));
    var dots = [].slice.call(story.querySelectorAll('.story-dots span'));
    var durations = [9000, 4500, 3000, 5500];
    var i = 0;
    function show(n) {
      scenes.forEach(function (s, k) {
        s.classList.toggle('active', k === n);
        s.classList.remove('run');
        if (k === n) {
          void s.offsetWidth; // restart CSS animations
          s.classList.add('run');
        }
      });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === n); });
    }
    show(0);
    setTimeout(function next() {
      i = (i + 1) % scenes.length;
      show(i);
      setTimeout(next, durations[i]);
    }, durations[0]);
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

  // ---------- Accessibility: skip-to-content link ----------
  function initSkipLink() {
    var target = document.querySelector('section, .content-wrap, .article-body, main');
    if (!target) return;
    if (!target.id) target.id = 'pageMain';
    var link = el('<a href="#' + target.id + '" class="skip-link">Skip to main content</a>');
    document.body.insertBefore(link, document.body.firstChild);
  }

  // ---------- Boot ----------
  function boot() {
    buildHeader();
    initAnalytics();
    initSkipLink();
    buildFooter();
    buildFloaters();
    buildModal();
    initScrollExtras();
    initNav();
    initForms();
    initCounters();
    initCarousel();
    initReviews();
    initRotator();
    initStory();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
