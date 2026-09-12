(() => {
'use strict';
const style=document.createElement('style');style.textContent="\n.super-mobile-objections[hidden]{display:none!important}\n.super-mobile-objections{--tp-card:#fff;--tp-border:#e1e4e9;--tp-text:#303643;--tp-muted:#69717f;padding:26px 0}\n.super-mobile-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}\n.super-mobile-heading h1{font-size:28px;margin:0 0 6px}\n.super-mobile-heading p{font-size:14px;color:var(--tp-muted);margin:0}\n.super-mobile-count{font-size:13px;color:var(--tp-muted);white-space:nowrap}\n.super-mobile-status{color:var(--tp-muted);font-size:14px;min-height:22px;margin:0 0 10px}\n.super-mobile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}\n.super-mobile-reply{background:var(--tp-card);border:1px solid var(--tp-border);border-radius:12px;padding:18px 20px}\n.super-mobile-reply-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:10px}\n.super-mobile-reply-heading h2{color:var(--tp-text);font-size:16px;line-height:1.4;margin:0;font-weight:650}\n.super-mobile-copy{font-size:14px;padding:9px 14px;min-height:40px;min-width:86px;white-space:nowrap;flex-shrink:0;align-self:center}\n.super-mobile-copy:disabled{opacity:.7;cursor:wait}\n.super-mobile-reply-text{font-size:16px;line-height:1.6;color:var(--tp-text);margin:0;user-select:text}\nhtml[data-theme=\"dark\"] .super-mobile-objections{--tp-card:#1a1f28;--tp-border:#333b48;--tp-text:#e3e8f1;--tp-muted:#aab5c6}\n@media(max-width:1050px){.super-mobile-grid{grid-template-columns:1fr}}\n@media(max-width:480px){.super-mobile-reply{padding:16px}.super-mobile-heading h1{font-size:25px}.super-mobile-count{display:none}.super-mobile-reply-heading{gap:10px}}\n";document.head.append(style);
const replies=[["TO BE SENT BEFORE THE PITCH","I've taken a look at the network speeds in your area and you are eligible for 5G+ FastTrack SuperMobile plans! Offering up to 1gbps speeds you would benefit from 4x the speeds on your own exclusive priority data line, even in congested areas you will be getting the best from our network. I'll see what we can get sorted for you on this fantastic new service today!"],["TO BE SENT WITH SUPERMOBILE PITCH","This would also get you inclusive SecureNet, keeping your device safe from all threats and potential scams. And in the event the speeds aren't quite up to scratch there is a minimum guarantee of 15mbps, so if you're not getting this we can look at getting the plan cancelled for you!"]];
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const breadcrumb=document.querySelector('.workspace-header > span');
const defaultBreadcrumb='Sales workspace / Pitch builder';
const nav=document.createElement('a');nav.id='super-mobile-objections-link';nav.href='#super-mobile-objections';nav.textContent='Super mobile';
const anchor=document.getElementById('third-party-objections-link');
if(anchor)anchor.after(nav);else sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');section.id='super-mobile-objections';section.className='super-mobile-objections';section.hidden=true;section.setAttribute('aria-labelledby','super-mobile-title');
section.innerHTML='<div class="super-mobile-heading"><div><h1 id="super-mobile-title">Super mobile</h1><p>Copy the introduction before your pitch, then send the benefits alongside it.</p></div><span class="super-mobile-count">2 pitches</span></div><p id="super-mobile-copy-status" class="super-mobile-status" role="status" aria-live="polite"></p><div class="super-mobile-grid"></div>';
const grid=section.querySelector('.super-mobile-grid'),status=section.querySelector('#super-mobile-copy-status');
replies.forEach(([title,text],i)=>{
 const article=document.createElement('article');article.className='super-mobile-reply';
 const head=document.createElement('div');head.className='super-mobile-reply-heading';
 const heading=document.createElement('h2');heading.textContent=(i+1)+'. '+title;
 const copy=document.createElement('button');copy.type='button';copy.className='super-mobile-copy';copy.textContent='Copy';copy.setAttribute('aria-label','Copy reply '+(i+1)+': '+title);
 const body=document.createElement('p');body.className='super-mobile-reply-text';body.textContent=text;
 copy.addEventListener('click',async()=>{
  copy.disabled=true;
  try {
   if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);
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
 if(breadcrumb?.textContent==='Sales workspace / Super mobile')breadcrumb.textContent=defaultBreadcrumb;
 if(location.hash==='#super-mobile-objections')history.replaceState(null,'',location.pathname+location.search);
}
function show(event){
 event?.preventDefault();
 for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}
 for(const id of ['conversion-tracker','third-party-objections','pro-rata-calc']){const el=document.getElementById(id);if(el)el.hidden=true;}
 sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 section.hidden=false;if(breadcrumb)breadcrumb.textContent='Sales workspace / Super mobile';
 if(location.hash!=='#super-mobile-objections')history.replaceState(null,'','#super-mobile-objections');
}
nav.addEventListener('click',show);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hide);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hide();return render.apply(this,args);};}
if(location.hash==='#super-mobile-objections')show();
})();