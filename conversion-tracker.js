(() => {
'use strict';
function calculate(chatsText, salesText) {
  if (chatsText.trim() === '' || salesText.trim() === '') return {error:'Enter both totals to calculate your conversion.'};
  const chats = Number(chatsText), sales = Number(salesText);
  if (![chats,sales].every(n => Number.isSafeInteger(n) && n >= 0)) return {error:'Use zero or a positive whole number for each total.'};
  if (chats === 0) return {chats,sales,rate:null,error:sales > 0 ? 'Enter at least one chat to calculate a conversion rate.' : ''};
  return {chats,sales,rate:sales / chats * 100,error:''};
}
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const key='pitch-studio-conversion-totals-v1';
const nav=document.createElement('a');nav.id='conversion-tracker-link';nav.href='#conversion-tracker';nav.textContent='Conversion Tracker';
sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');section.id='conversion-tracker';section.className='conversion-tracker';section.hidden=true;section.setAttribute('aria-labelledby','conversion-title');
section.innerHTML=`
<div class="title-block"><p class="eyebrow">YOUR SALES PERFORMANCE</p><h1 id="conversion-title">Conversion Tracker</h1><p class="conversion-intro">Keep track of your chats, sales and conversion rate.</p></div>
<div class="conversion-grid">
  <div class="conversion-input-card">
    <div class="panel-heading"><span class="step-number">01</span><div><h2>Your totals</h2><p>Enter the numbers for the period you’re tracking.</p></div></div>
    <form id="conversion-form" autocomplete="off">
      <div><label for="conversion-chats">Total chats</label><input id="conversion-chats" type="number" min="0" step="1" inputmode="numeric" value="0" aria-describedby="conversion-error"></div>
      <div><label for="conversion-sales">Total sales</label><input id="conversion-sales" type="number" min="0" step="1" inputmode="numeric" value="0" aria-describedby="conversion-error"></div>
      <p id="conversion-error" class="conversion-error" role="status"></p>
    </form>
    <p class="conversion-storage" id="conversion-storage">Totals are saved in this browser only. Replace them when you start a new period.</p>
  </div>
  <div class="conversion-result-card" aria-live="polite" aria-atomic="true">
    <p class="conversion-result-label">CONVERSION RATE</p>
    <div class="conversion-value" id="conversion-rate">—</div>
    <p class="conversion-summary" id="conversion-summary">Enter your totals to get started.</p>
    <div class="conversion-formula">Sales ÷ chats × 100</div>
    <p class="conversion-explanation" id="conversion-explanation">Your rate updates as you type.</p>
  </div>
</div>`;
main.append(section);
const chats=section.querySelector('#conversion-chats'),sales=section.querySelector('#conversion-sales'),error=section.querySelector('#conversion-error'),rate=section.querySelector('#conversion-rate'),summary=section.querySelector('#conversion-summary'),explanation=section.querySelector('#conversion-explanation'),storage=section.querySelector('#conversion-storage');
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&Number.isSafeInteger(saved.chats)&&saved.chats>=0&&Number.isSafeInteger(saved.sales)&&saved.sales>=0){chats.value=saved.chats;sales.value=saved.sales;}}catch{storage.textContent='Browser saving is unavailable. Totals will last for this page session.';}
function update(persist) {
  const result=calculate(chats.value,sales.value);
  error.textContent=result.error;
  for(const input of [chats,sales])input.setAttribute('aria-invalid',String(input.value!==''&&(!Number.isSafeInteger(Number(input.value))||Number(input.value)<0)));
  rate.textContent=result.error||result.rate===null?'—':result.rate.toFixed(2)+'%';
  summary.textContent=result.error?'Check your totals above.':result.chats===0?'No chats recorded yet.':result.sales+' '+(result.sales===1?'sale':'sales')+' from '+result.chats+' '+(result.chats===1?'chat':'chats');
  explanation.textContent=result.rate>100?'More than one sale per chat can produce a rate above 100%.':'Your rate updates as you type.';
  if(persist&&!result.error){try{localStorage.setItem(key,JSON.stringify({chats:result.chats,sales:result.sales}));storage.textContent='Totals are saved in this browser only. Replace them when you start a new period.';}catch{storage.textContent='Browser saving is unavailable. Totals will last for this page session.';}}
}
section.querySelector('#conversion-form').addEventListener('submit',event=>event.preventDefault());
chats.addEventListener('input',()=>update(true));sales.addEventListener('input',()=>update(true));update(false);
const breadcrumb=document.querySelector('.workspace-header > span');
const previousBreadcrumb=breadcrumb?.innerHTML;
function hideTracker(){section.hidden=true;nav.classList.remove('active');nav.removeAttribute('aria-current');if(breadcrumb&&previousBreadcrumb!==undefined)breadcrumb.innerHTML=previousBreadcrumb;if(location.hash==='#conversion-tracker')history.replaceState(null,'',location.pathname+location.search);}
function showTracker(event){event?.preventDefault();for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});section.hidden=false;if(breadcrumb)breadcrumb.textContent='Sales workspace / Conversion Tracker';if(location.hash!=='#conversion-tracker')history.replaceState(null,'','#conversion-tracker');}
nav.addEventListener('click',showTracker);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hideTracker);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hideTracker();return render.apply(this,args);};}
if(location.hash==='#conversion-tracker')showTracker();
})();