const APP = {
  "id": 1,
  "name": "Library Desk",
  "subtitle": "Books & study materials",
  "description": "Find books, check borrowing records and manage library stock.",
  "plural": "Books",
  "searchlabel": "Book title",
  "metalabel": "Author / subject",
  "statuslabel": "Available",
  "addlabel": "Add book",
  "fields": [
    "Title",
    "Author",
    "Category",
    "Copies"
  ],
  "actions": [
    "Search catalog",
    "Issue book",
    "Return book",
    "Check fine"
  ],
  "records": [
    {
      "title": "Clean Code",
      "meta": "Robert C. Martin",
      "detail": "Software",
      "status": "Available"
    },
    {
      "title": "Database Systems",
      "meta": "R. Elmasri",
      "detail": "Computer Science",
      "status": "Issued"
    },
    {
      "title": "Operating Systems",
      "meta": "A. Silberschatz",
      "detail": "Computer Science",
      "status": "Available"
    }
  ],
  "accent": "#245c78"
};
const $ = s => document.querySelector(s);
const storeKey = `ip-lab-${APP.id}`;
let records = JSON.parse(localStorage.getItem(storeKey) || 'null') || APP.records;
let chosen = '';
const safe = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){localStorage.setItem(storeKey,JSON.stringify(records));}
function render(){
 const q=$('#search').value.toLowerCase();
 const visible=records.filter(r=>(r.title+' '+r.meta+' '+r.detail+' '+r.status).toLowerCase().includes(q));
 $('#items').innerHTML=visible.length?visible.map((r,n)=>`<article class="item"><div class="itemtop"><div><h3>${safe(r.title)}</h3><p>${safe(r.meta)}</p><p>${safe(r.detail)}</p></div><span class="tag">${safe(r.status)}</span></div><div class="actions"><button class="secondary" data-action="select" data-index="${records.indexOf(r)}">View / select</button><button class="secondary" data-action="status" data-index="${records.indexOf(r)}">Update status</button></div></article>`).join(''):'<div class="empty">No matching records.</div>';
 $('#count').textContent=records.length; $('#shown').textContent=visible.length;
 $('#summary').textContent=records.filter(r=>/available|open|active|in stock|approved|featured|normal/i.test(r.status)).length;
}
function showNotice(msg){const n=$('#notice');n.textContent=msg;n.style.display='block';setTimeout(()=>n.style.display='none',2600)}
function renderForm(){ $('#fields').innerHTML=APP.fields.map((f,i)=>`<label for="f${i}">${safe(f)}</label><input id="f${i}" name="f${i}" ${i===0?'required':''} placeholder="Enter ${safe(f.toLowerCase())}">`).join(''); }
$('#search').addEventListener('input',render);
$('#recordForm').addEventListener('submit',e=>{e.preventDefault();const vals=APP.fields.map((_,i)=>$('#f'+i).value.trim());if(!vals[0])return;records.unshift({title:vals[0],meta:vals.slice(1,3).filter(Boolean).join(' · ')||APP.subtitle,detail:vals.slice(3).filter(Boolean).join(' · ')||'Added locally',status:'New'});save();e.target.reset();render();showNotice(`${APP.addlabel} saved in this browser.`)});
$('#items').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const r=records[+b.dataset.index];if(b.dataset.action==='select'){chosen=r.title;$('#selected').textContent=`Selected: ${r.title}`;showNotice(`${r.title} selected.`)}else{r.status=r.status==='Available'?'Booked':r.status==='Booked'?'Available':r.status==='Open'?'In progress':r.status==='In progress'?'Closed':'Updated';save();render();showNotice(`Status updated: ${r.title}`)}});
$('#actionList').innerHTML=APP.actions.map((a,i)=>`<button class="secondary" data-task="${i}">${safe(a)}</button>`).join('');
$('#actionList').addEventListener('click',e=>{const b=e.target.closest('button[data-task]');if(!b)return;const task=APP.actions[+b.dataset.task];if(/search|find|filter|browse/i.test(task)){$('#search').focus();showNotice('Enter a keyword in the search field.')}else if(/add|submit|create|post/i.test(task)){document.querySelector('#f0').focus();showNotice('Complete the form to add a record.')}else if(/cart|wishlist/i.test(task)){showNotice(chosen?`${chosen} added to your local selection.`:'Select a record first.')}else if(/vote/i.test(task)){if(localStorage.getItem(storeKey+'-voted'))showNotice('A demonstration vote has already been recorded.');else{localStorage.setItem(storeKey+'-voted','yes');showNotice('Demo vote recorded locally.')}}else if(/payment|pay/i.test(task)){showNotice('Demo only: no payment is processed.')}else if(/qr|map|location/i.test(task)){showNotice('This prototype shows a local demo; external verification is not connected.')}else if(/cancel|return|renew|reschedule|update|verify|check|status|track|report|history|print|calendar|availability|seat|appointment|booking|application|feedback|reply|evidence|route|collection|donation|blood bank|mechanic/i.test(task)){if(!chosen)showNotice('Select a record first.');else showNotice(`${task}: ${chosen} · demo action completed.`)}else showNotice(`${task} is available as a demonstration action.`)});
$('#reset').addEventListener('click',()=>{records=APP.records.map(x=>({...x}));save();render();showNotice('Sample data restored.')});
$('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(records,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`experiment-${APP.id}-records.json`;a.click();URL.revokeObjectURL(a.href)});
renderForm();render();
