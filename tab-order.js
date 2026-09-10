(() => {
'use strict';
const sidebar=document.querySelector('.sidebar');
if(!sidebar)return;
const key='pitch-studio-tab-order-v1';
const links=[...sidebar.querySelectorAll('a')];
// CSS order previously pins the Knowledge Base to the bottom.
links.sort((a,b)=>Number(a.closest('.sidebar-bottom')!==null)-Number(b.closest('.sidebar-bottom')!==null));
const list=document.createElement('div');list.className='tab-order-list';
const help=document.createElement('p');help.className='tab-order-help';help.id='tab-order-help';help.textContent='Drag ⋮⋮ to reorder · or focus a handle and use ↑ / ↓';
const status=document.createElement('span');status.className='tab-order-status';status.setAttribute('role','status');
const reset=document.createElement('button');reset.type='button';reset.className='tab-order-reset';reset.textContent='Reset tab order';
const controls=document.createElement('div');controls.className='tab-order-controls';controls.append(reset,status);
const anchor=sidebar.querySelector('.nav-label');if(anchor)anchor.after(help,list,controls);else sidebar.append(help,list,controls);
const rows=links.map(link=>{
 const row=document.createElement('div');row.className='tab-order-row';row.dataset.tabKey=link.id||'tab:'+link.textContent.trim();
 const handle=document.createElement('button');handle.type='button';handle.className='tab-order-handle';handle.textContent='⋮⋮';handle.setAttribute('aria-label','Reorder '+link.textContent.trim());handle.setAttribute('aria-describedby',help.id);handle.title='Drag to reorder; use arrow keys when focused';
 link.draggable=false;row.append(link,handle);list.append(row);return row;
});
const bottom=sidebar.querySelector('.sidebar-bottom');if(bottom&&!bottom.children.length)bottom.hidden=true;
function save(){try{localStorage.setItem(key,JSON.stringify([...list.children].map(row=>row.dataset.tabKey)));status.textContent='Order saved';}catch{status.textContent='Order kept for this visit only';}}
function restore(saved){if(!Array.isArray(saved))return;const map=new Map(rows.map(row=>[row.dataset.tabKey,row]));for(const id of saved){if(map.has(id)){list.append(map.get(id));map.delete(id);}}for(const row of map.values())list.append(row);}
try{restore(JSON.parse(localStorage.getItem(key)||'null'));}catch{}
let drag=null,frame=0,latestY=0;
function moveAt(y){
 if(!drag)return;
 const others=[...list.children].filter(row=>row!==drag.row);
 const next=others.find(row=>{const r=row.getBoundingClientRect();return y<r.top+r.height/2;});
 if(next)list.insertBefore(drag.row,next);else list.append(drag.row);
}
function scroll(){
 if(!drag)return;
 const box=sidebar.getBoundingClientRect();
 const speed=latestY<box.top+65?-12:latestY>box.bottom-65?12:0;
 if(speed){sidebar.scrollTop+=speed;moveAt(latestY);}
 frame=requestAnimationFrame(scroll);
}
function finish(cancel=false){
 if(!drag)return;
 const current=drag;drag=null;cancelAnimationFrame(frame);current.row.classList.remove('tab-order-dragging');
 document.body.classList.remove('tab-order-drag-active');
 if(cancel)current.order.forEach(row=>list.append(row));else if(current.moved)save();
 current.handle.focus({preventScroll:true});
}
for(const row of rows){
 const handle=row.querySelector('button');
 handle.addEventListener('pointerdown',e=>{
  if(e.button!==0||drag)return;
  e.preventDefault();handle.focus({preventScroll:true});latestY=e.clientY;
  drag={row,handle,id:e.pointerId,startY:e.clientY,moved:false,order:[...list.children]};
 });
 handle.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&drag){e.preventDefault();finish(true);return;}
  if(drag||!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
  e.preventDefault();
  if(e.key==='ArrowUp'&&row.previousElementSibling)list.insertBefore(row,row.previousElementSibling);
  if(e.key==='ArrowDown'&&row.nextElementSibling)list.insertBefore(row.nextElementSibling,row);
  if(e.key==='Home')list.prepend(row);
  if(e.key==='End')list.append(row);
  handle.focus({preventScroll:true});row.scrollIntoView({block:'nearest'});save();
 });
}
document.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;latestY=e.clientY;
 if(!drag.moved&&Math.abs(e.clientY-drag.startY)<4)return;
 if(!drag.moved){drag.moved=true;drag.row.classList.add('tab-order-dragging');document.body.classList.add('tab-order-drag-active');frame=requestAnimationFrame(scroll);}
 e.preventDefault();moveAt(e.clientY);
},{passive:false});
document.addEventListener('pointerup',e=>{if(drag?.id===e.pointerId)finish();});
document.addEventListener('pointercancel',e=>{if(drag?.id===e.pointerId)finish(true);});
window.addEventListener('blur',()=>finish(true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drag){e.preventDefault();finish(true);}});
reset.addEventListener('click',()=>{finish(true);rows.forEach(row=>list.append(row));save();});
const style=document.createElement('style');
style.textContent='.tab-order-list{flex-shrink:0}.tab-order-row{display:flex;align-items:center;gap:2px;border-radius:9px}.sidebar .tab-order-row a{flex:1;min-width:0}.sidebar .tab-order-handle{flex:0 0 26px;padding:8px 2px;align-self:center;background:transparent;color:#7b8390;cursor:grab;touch-action:none;border-radius:5px;font-size:18px;letter-spacing:-3px}.sidebar .tab-order-handle:hover{background:#e9edf2}.tab-order-help{font-size:11px;line-height:1.5;color:#737986;margin:0 10px 10px}.tab-order-controls{margin:14px 10px 0;flex-shrink:0}.sidebar .tab-order-reset{font-size:11px;background:transparent;color:#737986;padding:4px 0}.tab-order-status{display:block;font-size:11px;color:#737986;min-height:17px}.tab-order-dragging{outline:2px solid #e60000;background:#fff0f0}.tab-order-drag-active,.tab-order-drag-active *{cursor:grabbing!important;user-select:none!important}.sidebar-bottom[hidden]{display:none!important}html[data-theme=dark] .tab-order-dragging{background:#392027}html[data-theme=dark] .sidebar .tab-order-handle:hover{background:#333b48}html[data-theme=dark] .tab-order-help,html[data-theme=dark] .tab-order-status,html[data-theme=dark] .sidebar .tab-order-reset,html[data-theme=dark] .sidebar .tab-order-handle{color:#aab5c6}';
document.head.append(style);
})();