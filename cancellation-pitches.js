(() => {
'use strict';
const style=document.createElement('style');style.textContent="\n.cancellation-pitches[hidden]{display:none!important}\n.cancellation-pitches{--tp-card:#fff;--tp-border:#e1e4e9;--tp-text:#303643;--tp-muted:#69717f;padding:26px 0}\n.cancellation-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}\n.cancellation-heading h1{font-size:28px;margin:0 0 6px}\n.cancellation-heading p{font-size:14px;color:var(--tp-muted);margin:0}\n.cancellation-count{font-size:13px;color:var(--tp-muted);white-space:nowrap}\n.cancellation-status{color:var(--tp-muted);font-size:14px;min-height:22px;margin:0 0 10px}\n.cancellation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}\n.cancellation-reply{background:var(--tp-card);border:1px solid var(--tp-border);border-radius:12px;padding:18px 20px}\n.cancellation-reply-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:10px}\n.cancellation-reply-heading h2{color:var(--tp-text);font-size:16px;line-height:1.4;margin:0;font-weight:650}\n.cancellation-copy{font-size:14px;padding:9px 14px;min-height:40px;min-width:86px;white-space:nowrap;flex-shrink:0;align-self:center}\n.cancellation-copy:disabled{opacity:.7;cursor:wait}\n.cancellation-reply-text{font-size:16px;line-height:1.6;color:var(--tp-text);margin:0;user-select:text}\nhtml[data-theme=\"dark\"] .cancellation-pitches{--tp-card:#1a1f28;--tp-border:#333b48;--tp-text:#e3e8f1;--tp-muted:#aab5c6}\n@media(max-width:1050px){.cancellation-grid{grid-template-columns:1fr}}\n@media(max-width:480px){.cancellation-reply{padding:16px}.cancellation-heading h1{font-size:25px}.cancellation-count{display:none}.cancellation-reply-heading{gap:10px}}\n";document.head.append(style);
const replies=[["💷 TOO EXPENSIVE","I completely understand, especially when keeping monthly costs down is important. Before we look at cancelling, I’ve checked your account and I can offer [OFFER] for [PRICE].\n\nThis would also mean you continue benefiting from Vodafone’s expanding combined network with Three, alongside your VeryMe Rewards and exclusive customer offers.\n\nWould that make staying with us more worthwhile?"],["🔄 FOUND A CHEAPER DEAL ELSEWHERE","I completely understand, price is always going to play a big part when comparing providers. I’ve checked what I can do for you and I can offer [OFFER] for [PRICE].\n\nIt’s also worth considering the overall service you’re getting with Vodafone, including access to our combined Vodafone and Three network for improved coverage, as well as VeryMe Rewards and customer perks.\n\nHow does that compare with the deal you’ve found?"],["📶 BAD SIGNAL / COVERAGE","I completely understand, having reliable signal is really important. Vodafone and Three are now combining their networks, allowing customers to automatically connect to the best available coverage across the two networks in supported areas, with even more improvements continuing to roll out.\n\nAlongside this, I can offer you [OFFER] for [PRICE].\n\nWith the improvements being made to the network, would you be willing to give us another chance?"],["📱 DON’T USE THE SERVICE ENOUGH","That makes complete sense. If you’re not using everything included in your current plan, I’d rather look at getting you onto something that better reflects what you actually use.\n\nI can offer [OFFER] for [PRICE], while still keeping you connected to Vodafone’s network benefits and giving you continued access to VeryMe Rewards.\n\nWould that be a better fit for you?"],["🚫 DON’T USE THE NUMBER ANYMORE","I completely understand. If you’re no longer using the number regularly, paying the current amount may not make much sense.\n\nBefore we cancel it completely, I can offer [OFFER] for [PRICE], which would allow you to keep the number active while still benefiting from Vodafone’s network and VeryMe Rewards.\n\nWould keeping the number at that price be useful to you?"],["❌ GENERAL CANCELLATION","I completely understand. Before we go ahead with cancelling, I just want to make sure we’ve looked at the best option available to you.\n\nI can offer [OFFER] for [PRICE].\n\nYou’d also continue getting the benefits of being with Vodafone, including our expanding combined network with Three, continued network investment and access to VeryMe Rewards.\n\nWould that be enough for you to reconsider cancelling?"],["🔢 PAC CODE REQUEST","Of course, I can help with getting your PAC code. Before we continue with that, I’ve checked your account and there is another option available that I’d like to make you aware of.\n\nI can offer [OFFER] for [PRICE].\n\nYou’d also keep access to Vodafone’s expanding combined network with Three and your VeryMe Rewards benefits.\n\nHow does that compare with what you’re looking to move to?"],["➡️ “I JUST WANT MY PAC”","Absolutely, I understand. Before I continue with the PAC request, I just want to make you aware of the best option I have available.\n\nI can offer [OFFER] for [PRICE], while keeping you on Vodafone with the benefits of our expanding combined network with Three and VeryMe Rewards.\n\nIf that wouldn’t change your decision, we can continue with the PAC request."],["😕 NOT HAPPY WITH VODAFONE / SERVICE","I completely understand, and naturally I’d want to see if there’s anything we can do to change your experience before you leave.\n\nThere’s currently a huge amount of investment going into the Vodafone and Three network, improving coverage, capacity and reliability across the UK.\n\nAlongside that, I can offer [OFFER] for [PRICE].\n\nWould you be willing to give us another chance with this option?"]];
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const breadcrumb=document.querySelector('.workspace-header > span');
const defaultBreadcrumb='Sales workspace / Pitch builder';
const nav=document.createElement('a');nav.id='cancellation-pitches-link';nav.href='#cancellation-pitches';nav.textContent='Cancellation pitches';
const anchor=document.getElementById('third-party-objections-link');
if(anchor)anchor.after(nav);else sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');section.id='cancellation-pitches';section.className='cancellation-pitches';section.hidden=true;section.setAttribute('aria-labelledby','cancellation-title');
section.innerHTML='<div class="cancellation-heading"><div><h1 id="cancellation-title">Cancellation pitches</h1><p>Enter your offer and price once, then copy the reply you need.</p></div><span class="cancellation-count">9 pitches</span></div><p id="cancellation-copy-status" class="cancellation-status" role="status" aria-live="polite"></p><div class="cancellation-grid"></div>';
const grid=section.querySelector('.cancellation-grid'),status=section.querySelector('#cancellation-copy-status');

const fields=document.createElement('form');fields.className='cancellation-fields';fields.autocomplete='off';
fields.innerHTML='<div><label for="cancellation-offer">Your offer</label><input id="cancellation-offer" type="text" placeholder="e.g. 100GB with unlimited minutes and texts" required></div><div><label for="cancellation-price">Price</label><input id="cancellation-price" type="text" placeholder="e.g. £15 per month" required></div><button type="reset">Clear offer</button>';
section.querySelector('.cancellation-heading').after(fields);
fields.addEventListener('submit',e=>e.preventDefault());
const offer=fields.querySelector('#cancellation-offer'),price=fields.querySelector('#cancellation-price');
const previews=[];
function fill(text){return text.replace(/\[OFFER\]|\[PRICE\]/g,token=>token==='[OFFER]'?(offer.value.trim()||token):(price.value.trim()||token));}
function refresh(){previews.forEach(({body,text,copy})=>{body.textContent=fill(text);copy.textContent='Copy';});status.textContent='';}
fields.addEventListener('input',()=>{offer.setCustomValidity('');price.setCustomValidity('');refresh();});
fields.addEventListener('reset',()=>{offer.value='';price.value='';refresh();});
const extraStyle=document.createElement('style');extraStyle.textContent='.cancellation-reply-text{white-space:pre-wrap}.cancellation-fields{display:grid;grid-template-columns:2fr 1fr auto;gap:14px;align-items:end;background:var(--tp-card);border:1px solid var(--tp-border);padding:18px;border-radius:12px;margin:0 0 14px}.cancellation-fields label{color:var(--tp-text)}.cancellation-fields button{align-self:end;background:var(--tp-card);color:var(--tp-text);border:1px solid var(--tp-border);font-size:14px;padding:11px}.cancellation-fields input{background:var(--tp-card);color:var(--tp-text);border-color:var(--tp-border)}@media(max-width:700px){.cancellation-fields{grid-template-columns:1fr}.cancellation-fields button{justify-self:start}}';document.head.append(extraStyle);
replies.forEach(([title,text],i)=>{

 const article=document.createElement('article');article.className='cancellation-reply';
 const head=document.createElement('div');head.className='cancellation-reply-heading';
 const heading=document.createElement('h2');heading.textContent=(i+1)+'. '+title;
 const copy=document.createElement('button');copy.type='button';copy.className='cancellation-copy';copy.textContent='Copy';copy.setAttribute('aria-label','Copy reply '+(i+1)+': '+title);
 const body=document.createElement('p');body.className='cancellation-reply-text';body.textContent=fill(text);previews.push({body,text,copy});
 copy.addEventListener('click',async()=>{
  offer.setCustomValidity(offer.value.trim()?'':'Enter your offer.');price.setCustomValidity(price.value.trim()?'':'Enter your price.');
  if(!fields.reportValidity())return;
  body.textContent=fill(text);
  copy.disabled=true;
  try {
   if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(body.textContent);
   copy.textContent='Copied ✓';status.textContent='Reply '+(i+1)+' copied.';
   setTimeout(()=>{copy.textContent='Copy';},1800);
  }catch{
   const range=document.createRange();range.selectNodeContents(body);
   const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);
   status.textContent='Reply '+(i+1)+' selected. Press Ctrl+C or use your device’s Copy option.';
  }finally{copy.disabled=false;}
 });
 head.append(heading,copy);article.append(head,body);grid.append(article);
});
main.append(section);
function hide(){
 section.hidden=true;nav.classList.remove('active');nav.removeAttribute('aria-current');
 if(breadcrumb?.textContent==='Sales workspace / Cancellation pitches')breadcrumb.textContent=defaultBreadcrumb;
 if(location.hash==='#cancellation-pitches')history.replaceState(null,'',location.pathname+location.search);
}
function show(event){
 event?.preventDefault();
 for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}
 for(const id of ['conversion-tracker','third-party-objections','pro-rata-calc','super-mobile-objections']){const el=document.getElementById(id);if(el)el.hidden=true;}
 sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 section.hidden=false;if(breadcrumb)breadcrumb.textContent='Sales workspace / Cancellation pitches';
 if(location.hash!=='#cancellation-pitches')history.replaceState(null,'','#cancellation-pitches');
}
nav.addEventListener('click',show);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hide);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hide();return render.apply(this,args);};}
if(location.hash==='#cancellation-pitches')show();
})();