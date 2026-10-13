(() => {
"use strict";
const { $,escapeHtml,getData,saveData,uniqueId,normalizeUrl,looksLikeMarkdownUrl }=window.DocsHub;
// This is a demonstration gate only. Credentials are visible in static JavaScript and are NOT secure.
const DEMO_USERNAME="Surya J";
const DEMO_PASSWORD="123456";
const SESSION_KEY="docshub-admin-session";
let data=getData();
const show=(el,on=true)=>{el.hidden=!on;};
function message(id,text,type="error"){const el=$("#"+id);el.textContent=text;el.className="alert "+(type==="error"?"alert-error":type==="success"?"alert-success":"alert-warning");show(el,true);}
function clearMessage(id){const el=$("#"+id);if(el){el.textContent="";show(el,false);}}
function persist(){saveData(data);$("#manual-stat").textContent=data.manuals.length;$("#faq-stat").textContent=data.faqs.length;$("#saved-stat").textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}
function enterDashboard(){show($("#login-view"),false);show($("#dashboard-view"),true);renderManualAdmin();renderFaqAdmin();persist();}
function logOut(){sessionStorage.removeItem(SESSION_KEY);show($("#dashboard-view"),false);show($("#login-view"),true);$("#password").value="";}
const loginForm = $("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    clearMessage("login-error");
    try {
      const u = $("#username").value.trim();
      const p = $("#password").value;
      if (u === DEMO_USERNAME && p === DEMO_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "yes");
        enterDashboard();
      } else {
        message("login-error", "Incorrect username or password. Please try again.");
      }
    } catch (err) {
      console.error("DocsHub login failed:", err);
      message("login-error", "Login could not continue. Please reload the page and try again. Details: " + (err?.message || "unknown error"));
    }
  });
}
const logoutButton = $("#logout-btn");
if (logoutButton) logoutButton.addEventListener("click", logOut);
try {
  if (sessionStorage.getItem(SESSION_KEY) === "yes") enterDashboard();
} catch (err) {
  console.error("DocsHub session storage unavailable:", err);
  message("login-error", "This browser blocked session storage. Enable site storage or use a normal browser window, then reload.");
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));["manuals-panel","faqs-panel","settings-panel"].forEach(id=>show($("#"+id),id===btn.dataset.tab));}));

function renderManualAdmin(){const root=$("#manual-list-admin");root.replaceChildren();if(!data.manuals.length){root.innerHTML='<p class="empty">No manuals yet. Select “Add manual” to create one.</p>';return;}data.manuals.forEach(m=>{const el=document.createElement("article");el.className="managed-item";el.innerHTML=`<div class="managed-icon">▤</div><div class="managed-copy"><strong>${escapeHtml(m.title)}</strong><p>${escapeHtml(m.category||"Uncategorized")} · Updated ${escapeHtml(m.updated||"—")}</p><p>${escapeHtml(m.description||"")}</p>${m.url?`<a href="${escapeHtml(m.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(m.url)}</a>`:'<span class="muted">Inline sample Markdown</span>'}</div><div class="managed-actions"><button class="btn btn-small" data-edit="${escapeHtml(m.id)}">Edit</button><button class="btn btn-small btn-danger" data-delete="${escapeHtml(m.id)}">Delete</button></div>`;root.append(el);});}
function renderFaqAdmin(){const root=$("#faq-list-admin");root.replaceChildren();if(!data.faqs.length){root.innerHTML='<p class="empty">No FAQs yet. Select “Add FAQ” to create one.</p>';return;}data.faqs.forEach(f=>{const el=document.createElement("article");el.className="managed-item";el.innerHTML=`<div class="managed-icon">?</div><div class="managed-copy"><strong>${escapeHtml(f.question)}</strong><p>${escapeHtml(f.category||"General")}</p><p>${escapeHtml(f.answer)}</p></div><div class="managed-actions"><button class="btn btn-small" data-edit-faq="${escapeHtml(f.id)}">Edit</button><button class="btn btn-small btn-danger" data-delete-faq="${escapeHtml(f.id)}">Delete</button></div>`;root.append(el);});}
function resetManualForm(){ $("#manual-form").reset();$("#manual-id").value="";clearMessage("manual-form-error");show($("#manual-form-wrap"),false);}
$("#add-manual-btn").addEventListener("click",()=>{resetManualForm();show($("#manual-form-wrap"),true);$("#manual-title").focus();});
$("#cancel-manual").addEventListener("click",resetManualForm);
$("#manual-list-admin").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");
 if(edit){const m=data.manuals.find(x=>x.id===edit.dataset.edit);if(!m)return;$("#manual-id").value=m.id;$("#manual-title").value=m.title;$("#manual-category").value=m.category||"";$("#manual-url").value=m.url||"";$("#manual-description").value=m.description||"";clearMessage("manual-form-error");show($("#manual-form-wrap"),true);$("#manual-form-wrap").scrollIntoView({behavior:"smooth"});}
 if(del){const m=data.manuals.find(x=>x.id===del.dataset.delete);if(!m)return;if(confirm(`Delete “${m.title}”? This cannot be undone in this browser.`)){data.manuals=data.manuals.filter(x=>x.id!==m.id);try{persist();renderManualAdmin();}catch(err){message("manual-form-error",err.message);}}}
});
$("#manual-form").addEventListener("submit",e=>{
 e.preventDefault();clearMessage("manual-form-error");
 const id=$("#manual-id").value,title=$("#manual-title").value.trim(),category=$("#manual-category").value.trim(),url=$("#manual-url").value.trim(),description=$("#manual-description").value.trim();
 if(!title){message("manual-form-error","Please enter a title.");return;}
 if(!url){message("manual-form-error","Please enter a public GitHub Markdown URL.");return;}
 if(!looksLikeMarkdownUrl(url)){message("manual-form-error","Enter a valid public Markdown URL: raw.githubusercontent.com, a GitHub /blob/ URL, or a direct .md URL.");return;}
 const normalized=normalizeUrl(url);const duplicate=data.manuals.find(m=>m.id!==id&&(normalizeUrl(m.url)===normalized||m.title.trim().toLowerCase()===title.toLowerCase()));
 if(duplicate){message("manual-form-error",`Duplicate detected: “${duplicate.title}” already uses this title or URL. Edit the existing manual instead.`);return;}
 const item={id:id||uniqueId(),title,category,description,url,markdown:"",updated:new Date().toISOString().slice(0,10)};
 if(id)data.manuals=data.manuals.map(m=>m.id===id?item:m);else data.manuals.push(item);
 try{persist();renderManualAdmin();resetManualForm();message("settings-message","Manual saved in this browser. Export data and publish approved content to make it visible to all visitors.","success");}catch(err){message("manual-form-error",err.message);}
});

function resetFaqForm(){$("#faq-form").reset();$("#faq-id").value="";clearMessage("faq-form-error");show($("#faq-form-wrap"),false);}
$("#add-faq-btn").addEventListener("click",()=>{resetFaqForm();show($("#faq-form-wrap"),true);$("#faq-question").focus();});
$("#cancel-faq").addEventListener("click",resetFaqForm);
$("#faq-list-admin").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit-faq]");const del=e.target.closest("[data-delete-faq]");
 if(edit){const f=data.faqs.find(x=>x.id===edit.dataset.editFaq);if(!f)return;$("#faq-id").value=f.id;$("#faq-question").value=f.question;$("#faq-answer").value=f.answer;$("#faq-category").value=f.category||"";clearMessage("faq-form-error");show($("#faq-form-wrap"),true);$("#faq-form-wrap").scrollIntoView({behavior:"smooth"});}
 if(del){const f=data.faqs.find(x=>x.id===del.dataset.deleteFaq);if(!f)return;if(confirm(`Delete FAQ “${f.question}”?`)){data.faqs=data.faqs.filter(x=>x.id!==f.id);try{persist();renderFaqAdmin();}catch(err){message("faq-form-error",err.message);}}}
});
$("#faq-form").addEventListener("submit",e=>{
 e.preventDefault();clearMessage("faq-form-error");
 const id=$("#faq-id").value,question=$("#faq-question").value.trim(),answer=$("#faq-answer").value.trim(),category=$("#faq-category").value.trim();
 if(!question||!answer){message("faq-form-error","Both question and answer are required.");return;}
 const dup=data.faqs.find(f=>f.id!==id&&f.question.trim().toLowerCase()===question.toLowerCase());
 if(dup){message("faq-form-error",`Duplicate question detected. “${dup.question}” already exists.`);return;}
 const item={id:id||uniqueId(),question,answer,category};
 if(id)data.faqs=data.faqs.map(f=>f.id===id?item:f);else data.faqs.push(item);
 try{persist();renderFaqAdmin();resetFaqForm();message("settings-message","FAQ saved in this browser. Export data and publish approved content to make it visible to all visitors.","success");}catch(err){message("faq-form-error",err.message);}
});
$("#export-btn").addEventListener("click",()=>{try{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="docshub-content-export.json";a.click();URL.revokeObjectURL(url);message("settings-message","Content exported. Review the file before publishing it to your public repository.","success");}catch(err){message("settings-message","Export failed: "+err.message);}});
$("#import-file").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!parsed||!Array.isArray(parsed.manuals)||!Array.isArray(parsed.faqs))throw Error("JSON must contain manuals and faqs arrays.");const manualTitles=new Set(),manualUrls=new Set();for(const m of parsed.manuals){const t=(m.title||"").trim().toLowerCase(),u=normalizeUrl(m.url);if(!t)throw Error("Every manual needs a title.");if(t&&manualTitles.has(t))throw Error("Duplicate manual title found: "+m.title);manualTitles.add(t);if(u&&manualUrls.has(u))throw Error("Duplicate manual URL found: "+m.url);if(u)manualUrls.add(u);}const questions=new Set();for(const f of parsed.faqs){const q=(f.question||"").trim().toLowerCase();if(!q||!f.answer)throw Error("Every FAQ needs a question and answer.");if(questions.has(q))throw Error("Duplicate FAQ question found: "+f.question);questions.add(q);}data={manuals:parsed.manuals,faqs:parsed.faqs,settings:parsed.settings||{}};persist();renderManualAdmin();renderFaqAdmin();message("settings-message","Import successful.","success");}catch(err){message("settings-message","Import failed: "+err.message);}finally{e.target.value="";}});
$("#reset-btn").addEventListener("click",()=>{if(!confirm("Reset the content in this browser to the starter demo data?"))return;data=structuredClone(window.DocsHub.DEFAULT_DATA);try{persist();renderManualAdmin();renderFaqAdmin();message("settings-message","Demo data restored.","success");}catch(err){message("settings-message",err.message);}});
})();
