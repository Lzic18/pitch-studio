(() => {
'use strict';
const replies=[["Price & overall value","I appreciate that price is important. While you may find lower rates through third parties, booking directly with us gives you access to our full benefits, direct support and greater flexibility. Third-party bookings can have different terms and restrictions, so it's worth considering the overall value rather than just the initial price. Let me look into what we can do and then we can go from there!"],["Flexibility & peace of mind","I completely appreciate that. While the initial price may be higher, booking directly with us gives you access to benefits and support that aren't always available through third parties. Many customers find the added flexibility and peace of mind are worth considering when comparing the overall value, not just the headline price."],["What’s included","That's understandable. The difference often comes down to what's included. While a third-party rate may appear cheaper, booking directly with us means you're dealing with us from start to finish and can take advantage of the full range of benefits and support available to direct customers."],["Check the other offer","That's a fair point. Before making a decision, it's worth checking whether the other offer includes the same level of flexibility, support and benefits. Sometimes a lower price can come with different terms, so it's important to look at the overall value rather than the price alone."],["Compare like for like","I completely understand wanting to get the best price. My only advice would be to make sure you're comparing like for like. If you're committing to a 2-year contract, it's important to be confident about exactly what you're signing up for. With us, you know exactly what's included and the level of support you'll receive, so it's worth checking the terms and benefits of the other offer before making a decision."],["Two-year commitment","I appreciate that. As it's a 2-year commitment, I'd just encourage you to look beyond the upfront price and make sure you're comfortable with everything that's included. You know what you're getting with us, so it's worth taking a moment to check that the other provider offers the same level of service, support and flexibility."],["Respect their choice","Of course, and if the lower price works out to be the better option for you then that's absolutely fair. My only suggestion would be to make sure you know exactly what you're getting for that price. A 2-year contract is a long commitment, so it's important to understand the terms, support and benefits included, not just the monthly cost."]];
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const breadcrumb=document.querySelector('.workspace-header > span');
const defaultBreadcrumb='Sales workspace / Pitch builder';
const nav=document.createElement('a');nav.id='third-party-objections-link';nav.href='#third-party-objections';nav.textContent='Third Party Objections';
const anchor=[...sidebar.querySelectorAll('a')].find(a=>a.textContent==='Objection Handles');
if(anchor)anchor.after(nav);else sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');section.id='third-party-objections';section.className='third-party-objections';section.hidden=true;section.setAttribute('aria-labelledby','third-party-title');
section.innerHTML='<div class="third-party-heading"><div><h1 id="third-party-title">Third Party Objections</h1><p>Choose a reply and copy it straight into your chat.</p></div><span class="third-party-count">7 replies</span></div><p id="third-party-copy-status" class="third-party-status" role="status" aria-live="polite"></p><div class="third-party-grid"></div>';
const grid=section.querySelector('.third-party-grid'),status=section.querySelector('#third-party-copy-status');
replies.forEach(([title,text],i)=>{
 const article=document.createElement('article');article.className='third-party-reply';
 const head=document.createElement('div');head.className='third-party-reply-heading';
 const heading=document.createElement('h2');heading.textContent=(i+1)+'. '+title;
 const copy=document.createElement('button');copy.type='button';copy.className='third-party-copy';copy.textContent='Copy';copy.setAttribute('aria-label','Copy reply '+(i+1)+': '+title);
 const body=document.createElement('p');body.className='third-party-reply-text';body.textContent=text;
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
 if(breadcrumb?.textContent==='Sales workspace / Third Party Objections')breadcrumb.textContent=defaultBreadcrumb;
 if(location.hash==='#third-party-objections')history.replaceState(null,'',location.pathname+location.search);
}
function show(event){
 event?.preventDefault();
 for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}
 const tracker=document.getElementById('conversion-tracker');if(tracker)tracker.hidden=true;
 sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
 section.hidden=false;if(breadcrumb)breadcrumb.textContent='Sales workspace / Third Party Objections';
 if(location.hash!=='#third-party-objections')history.replaceState(null,'','#third-party-objections');
}
nav.addEventListener('click',show);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hide);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hide();return render.apply(this,args);};}
if(location.hash==='#third-party-objections')show();
})();