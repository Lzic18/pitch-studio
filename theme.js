(() => {
  'use strict';
  const key = 'pitch-studio-theme';
  const root = document.documentElement;
  let saved = 'light';
  try { if (localStorage.getItem(key) === 'dark') saved = 'dark'; } catch {}
  root.dataset.theme = saved;
  function sync() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.setAttribute('aria-checked', String(root.dataset.theme === 'dark'));
  }
  document.addEventListener('DOMContentLoaded', () => {
    sync();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch {}
      sync();
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      root.dataset.theme = event.newValue === 'dark' ? 'dark' : 'light';
      sync();
    }
  });
})();