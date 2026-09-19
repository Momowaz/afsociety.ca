(() => {
  'use strict';

  const form = document.querySelector('#directory-filters');
  const search = document.querySelector('#business-search');
  const category = document.querySelector('#business-category');
  const city = document.querySelector('#business-city');
  const count = document.querySelector('#results-count');
  const empty = document.querySelector('#directory-empty');
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const businesses = Array.from(document.querySelectorAll('.business-card'), card => ({
    card,
    text: normalize(card.textContent),
    categories: card.dataset.categories.split(' '),
    city: card.dataset.city,
  }));

  function filterBusinesses() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    businesses.forEach(business => {
      const matches = terms.every(term => business.text.includes(term))
        && (!category.value || business.categories.includes(category.value))
        && (!city.value || business.city === city.value);
      business.card.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = visible === businesses.length
      ? `Showing all ${visible} businesses`
      : `Showing ${visible} of ${businesses.length} businesses`;
    empty.hidden = visible !== 0;
  }

  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', filterBusinesses);
  category.addEventListener('change', filterBusinesses);
  city.addEventListener('change', filterBusinesses);
  form.addEventListener('reset', event => {
    event.preventDefault();
    search.value = '';
    category.value = '';
    city.value = '';
    filterBusinesses();
    search.focus();
  });
  document.querySelector('#empty-reset').addEventListener('click', () => form.reset());
  filterBusinesses();

  const toggle = document.querySelector('.nav-toggle');
  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(document.body.classList.toggle('nav-open')));
  });
  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu();
      toggle.focus();
    }
  });
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
})();
