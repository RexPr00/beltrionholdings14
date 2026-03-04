(function () {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));

  const lockScroll = (on) => document.body.classList.toggle('no-scroll', on);

  qsa('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.lang');
      wrap.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e) => {
    qsa('.lang').forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });

  const drawer = qs('[data-drawer]');
  const drawerBackdrop = qs('[data-drawer-backdrop]');
  const openBtn = qs('[data-open-drawer]');
  const closeBtn = qs('[data-close-drawer]');
  const focusableSelector = 'a, button, input, [tabindex]:not([tabindex="-1"])';

  let lastFocus = null;

  const trapFocus = (e) => {
    if (!drawer.classList.contains('open') || e.key !== 'Tab') return;
    const nodes = qsa(focusableSelector, drawer).filter((n) => !n.disabled);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    lockScroll(false);
    document.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  };

  const openDrawer = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    lockScroll(true);
    const first = qs(focusableSelector, drawer);
    if (first) first.focus();
    document.addEventListener('keydown', trapFocus);
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  qsa('[data-drawer] a').forEach((a) => a.addEventListener('click', closeDrawer));

  qsa('.faq-item').forEach((item) => {
    const btn = qs('.faq-q', item);
    btn.addEventListener('click', () => {
      qsa('.faq-item').forEach((i) => i.classList.remove('open'));
      item.classList.add('open');
    });
  });

  const modal = qs('[data-modal]');
  const openModal = qs('[data-open-privacy]');
  const closeModalBtns = qsa('[data-close-modal]');

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    lockScroll(false);
  }

  if (openModal) {
    openModal.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      lockScroll(true);
      const x = qs('.close-x', modal);
      if (x) x.focus();
    });
  }

  closeModalBtns.forEach((b) => b.addEventListener('click', closeModal));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.2 });

  qsa('.reveal').forEach((el) => io.observe(el));

  qsa('form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const box = qs('.form-note', f);
      if (box) box.textContent = 'After you sign up, you get instant access to the next steps. We may send a short email to confirm your details.';
    });
  });
})();
