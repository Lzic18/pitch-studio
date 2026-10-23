/* New starter chat handling reference. */
(function(){
'use strict';
const steps=[["Check DPA status and intent","Check the DPA status and the customer’s reason for contacting us. If the pre-chat intent is missing or not relevant, ask how you can help."],["Complete DPA and introduce broadband","Complete DPA. If the customer’s query is not about broadband, introduce the broadband pitch."],["Review other account opportunities","Keep the original query in mind. Check for other opportunities on the account and prepare a relevant pitch before moving on to the original query."],["Choose the starting offer","For broadband, start with the lowest price. For SIMs, start just below what the customer is currently paying, then work down depending on their usage."],["Understand why they decline","If the customer says no, ask why so you can understand their objection."],["Return to the original query","Complete any additional upgrade the customer accepts. If they decline, or there is nothing else to explore, move on to their original query."],["Pitch additional lines","After completing the original query, pitch additional lines at the end of the chat."],["Ask about their objection","If they say no, ask: “May I ask why this is?”"],["Complete the account notes","After an upgrade or cancellation, complete the We Care note for your comm. For other chats, complete the comm with a summary of what was discussed."]];
const sidebar=document.querySelector('.sidebar'),main=document.querySelector('.main-content');
if(!sidebar||!main)return;
const style=document.createElement('style');
style.textContent=`
#new-starter-guide[hidden]{display:none!important}
#new-starter-guide{max-width:960px;margin:0 auto;color:#303643}
#new-starter-guide h1{margin:0 0 8px;font-size:28px}
#new-starter-guide .starter-intro{color:#69717f;margin:0 0 24px;line-height:1.5}
#new-starter-guide ol{list-style:none;padding:0;margin:0;counter-reset:starter;display:grid;gap:10px}
#new-starter-guide li{counter-increment:starter;display:grid;grid-template-columns:36px 1fr;gap:14px;padding:18px 20px;border:1px solid #e1e4e9;border-radius:12px;background:#fff}
#new-starter-guide li:before{content:counter(starter);display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e60000;color:#fff;border-radius:9px;font-weight:700}
#new-starter-guide h2{font-size:16px;margin:3px 0 7px;color:inherit}
#new-starter-guide li p{font-size:14px;line-height:1.65;margin:0;color:inherit}
html[data-theme="dark"] #new-starter-guide{color:#e3e8f1}
html[data-theme="dark"] #new-starter-guide .starter-intro{color:#aab5c6}
html[data-theme="dark"] #new-starter-guide li{background:#1a1f28;border-color:#333b48}
@media(max-width:600px){#new-starter-guide li{padding:14px;gap:10px}}
`;
document.head.append(style);
const nav=document.createElement('a');
nav.id='new-starter-guide-link';nav.href='#new-starter-guide';nav.textContent='New Starter Guide';
sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));
const section=document.createElement('section');
section.id='new-starter-guide';section.hidden=true;section.setAttribute('aria-labelledby','starter-guide-title');
section.innerHTML='<h1 id="starter-guide-title">New Starter Guide</h1><p class="starter-intro">Your nine-step reference for handling chats, from the first checks to the final notes.</p><ol></ol>';
const list=section.querySelector('ol');
steps.forEach(([title,body])=>{
const item=document.createElement('li'),content=document.createElement('div'),heading=document.createElement('h2'),text=document.createElement('p');
heading.textContent=title;text.textContent=body;content.append(heading,text);item.append(content);list.append(item);
});
main.append(section);
const breadcrumb=document.querySelector('.workspace-header > span');
function hide(){
section.hidden=true;nav.classList.remove('active');nav.removeAttribute('aria-current');
if(breadcrumb?.textContent==='Sales workspace / New Starter Guide')breadcrumb.textContent='Sales workspace / Pitch builder';
if(location.hash==='#new-starter-guide')history.replaceState(null,'',location.pathname+location.search);
}
function show(event){
event?.preventDefault();
for(const id of ['welcome-content','template-content','branch-content','knowledge-base-section']){const el=document.getElementById(id);if(el)el.style.display='none';}
for(const id of ['conversion-tracker','third-party-objections','pro-rata-calc','super-mobile-objections','cancellation-pitches','hundred-gb-pitch']){const el=document.getElementById(id);if(el)el.hidden=true;}
sidebar.querySelectorAll('a').forEach(link=>{link.classList.toggle('active',link===nav);if(link===nav)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
section.hidden=false;
if(breadcrumb)breadcrumb.textContent='Sales workspace / New Starter Guide';
if(location.hash!=='#new-starter-guide')history.replaceState(null,'','#new-starter-guide');
}
nav.addEventListener('click',show);
sidebar.querySelectorAll('a').forEach(link=>{if(link!==nav)link.addEventListener('click',hide);});
if(typeof window.renderTemplate==='function'){const render=window.renderTemplate;window.renderTemplate=function(...args){hide();return render.apply(this,args);};}
if(location.hash==='#new-starter-guide')show();
})();