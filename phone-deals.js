/* Optional Phone Deals section. Remove this script and its stylesheet to undo. */
(() => {
  'use strict';
  const SOURCE = 'https://www.vodafone.co.uk/mobile/deals-and-offers';
  const CHECKED_DATE = '2026-09-10';
  const deals = [
    { brand: 'Apple', name: 'iPhone 17 Pro Max', saving: 'Up to £835', detail: 'Advertised saving with an eligible iPhone trade-in.', url: 'https://www.vodafone.co.uk/mobile/pay-monthly-contracts/apple/iphone-17-pro-max' },
    { brand: 'Samsung', name: 'Galaxy Z Fold8 Ultra', saving: 'Up to £1,750', detail: 'Advertised saving with an eligible phone trade-in. A separate £100 cashback promotion requires an additional selected Samsung device.', url: 'https://www.vodafone.co.uk/mobile/pay-monthly-contracts/samsung/galaxy-z-fold8-ultra' },
    { brand: 'Google', name: 'Pixel 11 Pro', saving: 'Up to £1,574', detail: 'Advertised saving with an eligible phone trade-in. Vodafone also lists a claimable starter bundle valued at £144.', url: 'https://www.vodafone.co.uk/mobile/pay-monthly-contracts/google/pixel-11-pro' }
  ];
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main-content');
  if (!sidebar || !main) return;
  const nav = document.createElement('a');
  nav.href = '#phone-deals';
  nav.id = 'phone-deals-link';
  nav.textContent = 'Phone Deals';
  sidebar.insertBefore(nav, sidebar.querySelector('.sidebar-bottom'));
  const section = document.createElement('section');
  section.id = 'phone-deals-section';
  section.className = 'phone-deals';
  section.hidden = true;
  section.setAttribute('aria-labelledby', 'phone-deals-title');
  section.innerHTML = `
    <div class="title-block"><p class="eyebrow">VODAFONE PUBLIC OFFERS</p><h1 id="phone-deals-title">Phone Deals</h1><p class="deals-intro">Selected phone promotions, with the conditions that matter.</p></div>
    <div class="deals-status"><div><strong>Offer snapshot · 10 September 2026</strong><p id="deals-freshness">Automatic updates are unavailable. Check Vodafone before quoting an offer.</p></div><a class="deals-source" href="${SOURCE}" target="_blank" rel="noopener noreferrer">Check current Vodafone offers <span aria-hidden="true">↗</span></a></div>
    <div class="deals-grid"></div>
    <div class="deals-note"><h2>Check the full offer before pitching</h2><p>These are advertised savings, not monthly prices. Trade-in eligibility, the selected plan and promotion terms affect the final offer. Check the product page for monthly and upfront costs, contract length, annual price increases and any claim deadlines. Account-specific upgrade offers may differ.</p><a href="${SOURCE}" target="_blank" rel="noopener noreferrer">Source: Vodafone deals and offers</a></div>`;
  const grid = section.querySelector('.deals-grid');
  for (const deal of deals) {
    const card = document.createElement('article');
    card.className = 'deal-card';
    const brand = document.createElement('p'); brand.className = 'deal-brand'; brand.textContent = deal.brand;
    const title = document.createElement('h2'); title.textContent = deal.name;
    const label = document.createElement('p'); label.className = 'deal-saving-label'; label.textContent = 'ADVERTISED SAVING';
    const saving = document.createElement('p'); saving.className = 'deal-saving'; saving.textContent = deal.saving;
    const tag = document.createElement('span'); tag.className = 'deal-condition'; tag.textContent = 'Eligible trade-in required';
    const detail = document.createElement('p'); detail.className = 'deal-detail'; detail.textContent = deal.detail;
    const link = document.createElement('a'); link.className = 'deal-link'; link.href = deal.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View offer on Vodafone ↗'; link.setAttribute('aria-label', 'View '+deal.name+' offer on Vodafone (opens a new tab)');
    card.append(brand,title,label,saving,tag,detail,link);grid.append(card);
  }
  main.append(section);
  const snapshotAge = Date.now() - Date.parse(CHECKED_DATE+'T00:00:00Z');
  if (snapshotAge > 48*60*60*1000) section.querySelector('#deals-freshness').textContent = 'This snapshot is over 48 hours old and may have expired. Open Vodafone to check current offers. Automatic updates are unavailable.';
  function showDeals(event) {
    event?.preventDefault();
    for (const id of ['welcome-content','template-content','branch-content','knowledge-base-section']) {const element=document.getElementById(id);if(element)element.style.display='none';}
    sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    section.hidden=false;
    if (location.hash !== '#phone-deals') history.replaceState(null,'','#phone-deals');
  }
  nav.addEventListener('click',showDeals);
  sidebar.querySelectorAll('a').forEach(link=>{if(link===nav)return;link.addEventListener('click',()=>{section.hidden=true;nav.classList.remove('active');nav.removeAttribute('aria-current');if(location.hash==='#phone-deals')history.replaceState(null,'',location.pathname+location.search);});});
  // Existing agent-driven template navigation also closes the optional section.
  if(typeof window.renderTemplate === 'function') {const render=window.renderTemplate;window.renderTemplate=function(...args){section.hidden=true;nav.classList.remove('active');nav.removeAttribute('aria-current');return render.apply(this,args);};}
  if(location.hash==='#phone-deals')showDeals();
})();
