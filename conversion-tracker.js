(() => {
'use strict';
function calculate(chatsText, salesText) {
  if (chatsText.trim() === '' || salesText.trim() === '') return {error:'Enter both totals to calculate your conversion.'};
  const chats = Number(chatsText), sales = Number(salesText);
  if (![chats,sales].every(n => Number.isSafeInteger(n) && n >= 0)) return {error:'Use zero or a positive whole number for each total.'};
  if (chats === 0) return {chats,sales,rate:null,error:sales > 0 ? 'Enter at least one chat to calculate a conversion rate.' : ''};
  return {chats,sales,rate:sales / chats * 100,error:''};
}
function reportSlot(now = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone:'Europe/London', hour:'2-digit', hourCycle:'h23' }).format(now));
  const slot = Math.floor(hour / 2) * 2;
  return '@' + (slot % 12 || 12) + (slot >= 12 ? 'pm' : 'am');
}
function formatReport(result, now = new Date()) {
  if(result.error) return '';
  return reportSlot(now) + '\n' + result.chats + ' chats\n' + result.sales + ' Sales\nConversion: ' + (result.rate === null ? 'N/A' : result.rate.toFixed(2) + '%');
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
    <div class="conversion-report-body">
      <label for="conversion-report">Your update</label>
      <textarea id="conversion-report" rows="4" readonly spellcheck="false" aria-describedby="conversion-report-help"></textarea>
      <div class="conversion-report-actions"><button type="button" id="copy-conversion-report">Copy update</button><span id="conversion-copy-status" role="status"></span></div>
      <p id="conversion-report-help">UK time · updates every two hours.</p>
    </div>
    <p class="conversion-storage" id="conversion-storage">Totals are saved in this browser only. Replace them when you start a new period.</p>
  </div>
  <div class="conversion-result-card" aria-live="polite" aria-atomic="true">
    <p class="conversion-result-label">CONVERSION RATE</p>
    <div class="conversion-value" id="conversion-rate">—</div>
    <p class="conversion-summary" id="conversion-summary">Enter your totals to get started.</p>
    <div class="conversion-formula">Sales ÷ chats × 100</div>
    <p class="conversion-explanation" id="conversion-explanation">Your rate updates as you type.</p>
  </div>
</div>
`;
main.append(section);
const chats=section.querySelector('#conversion-chats'),sales=section.querySelector('#conversion-sales'),error=section.querySelector('#conversion-error'),rate=section.querySelector('#conversion-rate'),summary=section.querySelector('#conversion-summary'),explanation=section.querySelector('#conversion-explanation'),storage=section.querySelector('#conversion-storage');
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&Number.isSafeInteger(saved.chats)&&saved.chats>=0&&Number.isSafeInteger(saved.sales)&&saved.sales>=0){chats.value=saved.chats;sales.value=saved.sales;}}catch{storage.textContent='Browser saving is unavailable. Totals will last for this page session.';}
const report=section.querySelector('#conversion-report'),copyReport=section.querySelector('#copy-conversion-report'),copyStatus=section.querySelector('#conversion-copy-status');
let lastReport='',lastSlot='';
function updateReport(result) {
  const text=formatReport(result);
  if(text!==lastReport){report.value=text;lastReport=text;copyStatus.textContent='';}
  lastSlot=reportSlot();
  copyReport.disabled=!!result.error;
  report.placeholder=result.error || '';
}
copyReport.addEventListener('click',async()=>{
  const result=calculate(chats.value,sales.value);
  updateReport(result);
  if(result.error)return;
  const text=report.value;
  try {
    if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    copyStatus.textContent=report.value===text?'Copied!':'Copied. The preview has since changed.';
  } catch {
    report.focus();report.select();
    copyStatus.textContent='Text selected. Copy it with Ctrl+C, or your device’s Copy option.';
  }
});
function refreshReportTime(){if(reportSlot()!==lastSlot)updateReport(calculate(chats.value,sales.value));}
function scheduleReportClock(){setTimeout(()=>{refreshReportTime();scheduleReportClock();},60000-Date.now()%60000+50);}
scheduleReportClock();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshReportTime();});
window.addEventListener('focus',refreshReportTime);
function update(persist) {
  const result=calculate(chats.value,sales.value);
  error.textContent=result.error;
  updateReport(result);
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