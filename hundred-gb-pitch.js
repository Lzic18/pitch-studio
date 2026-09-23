(() => {
'use strict';
const style=document.createElement('style');style.textContent="\n.hundred-gb-pitch[hidden]{display:none!important}\n.hundred-gb-pitch{--tp-card:#fff;--tp-border:#e1e4e9;--tp-text:#303643;--tp-muted:#69717f;padding:26px 0}\n.hundred-gb-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}\n.hundred-gb-heading h1{font-size:28px;margin:0 0 6px}\n.hundred-gb-heading p{font-size:14px;color:var(--tp-muted);margin:0}\n.hundred-gb-count{font-size:13px;color:var(--tp-muted);white-space:nowrap}\n.hundred-gb-status{color:var(--tp-muted);font-size:14px;min-height:22px;margin:0 0 10px}\n.hundred-gb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}\n.hundred-gb-reply{background:var(--tp-card);border:1px solid var(--tp-border);border-radius:12px;padding:18px 20px}\n.hundred-gb-reply-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:10px}\n.hundred-gb-reply-heading h2{color:var(--tp-text);font-size:16px;line-height:1.4;margin:0;font-weight:650}\n.hundred-gb-copy{font-size:14px;padding:9px 14px;min-height:40px;min-width:86px;white-space:nowrap;flex-shrink:0;align-self:center}\n.hundred-gb-copy:disabled{opacity:.7;cursor:wait}\n.hundred-gb-reply-text{font-size:16px;line-height:1.6;color:var(--tp-text);margin:0;user-select:text;white-space:pre-wrap}\nhtml[data-theme=\"dark\"] .hundred-gb-pitch{--tp-card:#1a1f28;--tp-border:#333b48;--tp-text:#e3e8f1;--tp-muted:#aab5c6}\n@media(max-width:1050px){.hundred-gb-grid{grid-template-columns:1fr}}\n@media(max-width:480px){.hundred-gb-reply{padding:16px}.hundred-gb-heading h1{font-size:25px}.hundred-gb-count{display:none}.hundred-gb-reply-heading{gap:10px}}\n";document.head.append(style);
const replies=[["Household savings","Just before we finish up, can I ask if anyone else in the household currently has their mobile SIM with another provider?\n\nI can add an additional line with a huge 100GB of data for just £10 a month, and they can even bring their existing number across. It could be a great way of getting them plenty of data while keeping the monthly cost down.\n\nWould anyone at home benefit from that?"],["Family or second SIM","One last thing before we finish up  I can currently add an extra line with a massive 100GB of data for only £10 a month.\n\nIt could be ideal for a partner, child, family member or even as a second SIM, especially for someone who uses plenty of data for streaming, social media or browsing\n\nDoes anyone come to mind who could make use of it?"],["Paying more elsewhere","Before we wrap everything up, is anyone else in the household currently paying more than £10 a month for their SIM?\n\nI can add an additional line with 100GB of data for just £10 a month, so if a partner or family member is paying more elsewhere, this could be a great opportunity to bring their number across and potentially reduce their monthly cost\n\nIs there anyone you can think of who might benefit from that?"]];
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const breadcrumb=document.querySelector('.workspace-header > span');
const defaultBreadcrumb='Sales workspace / Pitch builder';
const nav=document.createElement('a');nav.id='hundred-gb-pitch-link';nav.href='#hundred-gb-pitch';nav.textContent='100GB for £10 pitch';
const anchor=document.getElementById('third-party-objections-link');
if(anchor)anchor.after(nav);else sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');section.id='hundred-gb-pitch';section.className='hundred-gb-pitch';section.hidden=true;section.setAttribute('aria-labelledby','hundred-gb-title');
section.innerHTML='<div class="hundred-gb-heading"><div><h1 id="hundred-gb-title">100GB for £10 pitch</h1><p>Choose a pitch and copy it straight into your chat.</p></div><span class="hundred-gb-count">3 pitches</span></div><p id="hundred-gb-copy-status" class="hundred-gb-status" role="status" aria-live="polite"></p><div class="hundred-gb-grid"></div>';
const grid=section.querySelector('.hundred-gb-grid'),status=section.querySelector('#hundred-gb-copy-status');
replies.forEach(([title,text],i)=>{
 const article=document.createElement('article');article.className='hundred-gb-reply';
 const head=document.createElement('div');head.className='hundred-gb-reply-heading';
 const heading=document.createElement('h2');heading.textContent=(i+1)+'. '+title;
 const copy=document.createElement('button');copy.type='button';copy.className='hundred-gb-copy';copy.textContent='Copy';copy.setAttribute('aria-label','Copy reply '+(i+1)+': '+title);
 const body=document.createElement('p');body.className='hundred-gb-reply-text';const pattern=/(100GB of data for (?:just|only) £10 a month|£10 a month)/g;
 let start=0;for(const match of text.matchAll(pattern)){body.append(text.slice(start,match.index));const strong=document.createElement('strong');strong.textContent=match[0];body.append(strong);start=match.index+match[0].length;}body.append(text.slice(start));
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
 if(breadcrumb?.textContent==='Sales workspace / 100GB for £10 pitch')breadcrumb.textContent=defaultBreadcrumb;
 if(location.hash==='#hundred-gb-pitch')history.replaceState(null,'',location.pathname+location.search);
}
function show(event){
 event?.preventDefault();
 for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}
 for(const id of ['conversion-tracker','third-party-objections','pro-rata-calc','super-mobile-objections','cancellation-pitches']){const el=document.getElementById(id);if(el)el.hidden=true;}
 sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 section.hidden=false;if(breadcrumb)breadcrumb.textContent='Sales workspace / 100GB for £10 pitch';
 if(location.hash!=='#hundred-gb-pitch')history.replaceState(null,'','#hundred-gb-pitch');
}
nav.addEventListener('click',show);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hide);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hide();return render.apply(this,args);};}
if(location.hash==='#hundred-gb-pitch')show();
})();