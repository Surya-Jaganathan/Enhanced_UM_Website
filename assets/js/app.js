(() => {
  "use strict";
  // Content lives in the separate documentation repository. Change this URL to your repo's raw content URL.
  const CONTENT_BASE = "https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-DOCS-REPO/main/content";
  const SAMPLE_MODE = true; // Set false after replacing CONTENT_BASE and adding your content/index.json.
  const SAMPLE = {
    manuals: [
      {slug:"getting-started",title:"Getting started",category:"Getting started",description:"Set up your product and learn the essentials in a few easy steps.",updated:"2026-10-01",featured:true,access:"public",file:"getting-started.md",body:"# Getting started\n\nWelcome to your product documentation.\n\n## Before you begin\n\n- Check that you have everything listed in the product package.\n- Keep your product serial number handy.\n- Make sure your device is connected to a stable power source.\n\n## Set up your product\n\n1. Unpack the product and inspect it for visible damage.\n2. Connect the required cables or accessories.\n3. Switch on the device and wait for the status indicator.\n4. Follow the on-screen instructions to complete setup.\n\n> **Tip:** Keep this manual available for future reference.\n\n## Next steps\n\nReview the troubleshooting guide if you encounter a problem."},
      {slug:"account-setup",title:"Account setup and configuration",category:"Configuration",description:"Configure your preferences and get your workspace ready to use.",updated:"2026-09-25",featured:true,access:"public",file:"account-setup.md",body:"# Account setup and configuration\n\nUse this guide to configure the recommended settings for your workspace.\n\n## Configure preferences\n\n1. Open **Settings** from the main menu.\n2. Select the preference you want to change.\n3. Update the value and select **Save**.\n\n## Verify your settings\n\nReturn to the main screen and confirm that your changes are displayed.\n\n## Troubleshooting\n\nIf a setting is unavailable, check that your account has the required permissions."},
      {slug:"troubleshooting",title:"Troubleshooting guide",category:"Troubleshooting",description:"Diagnose common issues and follow recommended recovery steps.",updated:"2026-09-18",featured:true,access:"public",file:"troubleshooting.md",body:"# Troubleshooting guide\n\nUse these checks before contacting support.\n\n## The product will not start\n\n1. Check the power connection.\n2. Confirm the outlet is working.\n3. Disconnect accessories and try again.\n4. Record any indicator lights or error messages.\n\n## A feature is unavailable\n\n- Confirm the feature is enabled in settings.\n- Check your access permissions.\n- Restart the product if appropriate.\n\n## Contact support\n\nShare the product model, software version, and exact error message."}
    ],
    faqs: [
      {question:"Where can I find the latest user manual?",answer:"Browse the Manuals section on this page. The documentation team updates the published guide when a new version is available.",category:"Documentation"},
      {question:"Can I download a manual for offline use?",answer:"Open the manual and use your browser's Print option to save it as a PDF. If a downloadable PDF is provided, it will also appear among the manual resources.",category:"Documentation"},
      {question:"What should I include when reporting a problem?",answer:"Include the product model, software version, steps to reproduce the issue, the exact error message, and any troubleshooting steps you have already tried.",category:"Troubleshooting"},
      {question:"How do I suggest a correction to a guide?",answer:"Contact the support team and include the guide title, section heading, and the correction you recommend.",category:"Support"}
    ],
    quickLinks: [
      {title:"Contact support",description:"Get help from the support team.",url:"mailto:support@example.com",icon:"✉"},
      {title:"Product website",description:"Explore product details and updates.",url:"https://example.com",icon:"↗"},
      {title:"Release notes",description:"Review recent changes and improvements.",url:"#manuals",icon:"↻"}
    ],
    settings:{supportEmail:"support@example.com"}
  };
  const $ = (s, root=document) => root.querySelector(s);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeHref = value => {
    try { const u = new URL(value, location.href); return ["http:","https:","mailto:","#"].some(p => p === u.protocol || value.startsWith("#")) ? value : "#"; }
    catch { return value && value.startsWith("#") ? value : "#"; }
  };
  const slugify = s => String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  let data = SAMPLE;
  const allSearchable = () => [
    ...data.manuals.map(m=>({...m,type:"manual",searchText:[m.title,m.category,m.description,m.body].join(" ")})),
    ...data.faqs.map((f,i)=>({...f,slug:"faq-"+i,type:"faq",title:f.question,description:f.answer,searchText:[f.question,f.answer,f.category].join(" ")}))
  ];
  function renderManualCard(m) {
    const el = $("#manual-card-template").content.firstElementChild.cloneNode(true);
    $(".doc-category",el).textContent = m.category || "Guide";
    $(".doc-title",el).textContent = m.title;
    $(".doc-description",el).textContent = m.description || "";
    $(".doc-updated",el).textContent = m.updated ? "Updated " + m.updated : "User manual";
    const a = $(".doc-open",el); a.href = "#manual/" + encodeURIComponent(m.slug); a.setAttribute("aria-label","Read " + m.title);
    return el;
  }
  function renderManuals() {
    const featured = data.manuals.filter(m=>m.featured).slice(0,3);
    const grid = $("#featured-manuals"); grid.replaceChildren();
    if (!featured.length) grid.innerHTML='<p class="empty-state">No featured manuals yet. Add manuals to your content repository.</p>';
    else featured.forEach(m=>grid.append(renderManualCard(m)));
    const rest = data.manuals.filter(m=>!m.featured);
    const list = $("#manual-list"); list.replaceChildren();
    rest.forEach(m=>{
      const a=document.createElement("a");a.className="list-row";a.href="#manual/"+encodeURIComponent(m.slug);
      a.innerHTML='<span class="doc-icon" aria-hidden="true">▤</span><strong>'+esc(m.title)+'</strong><span class="list-meta">'+esc(m.category||"Guide")+'</span><span aria-hidden="true">→</span>';
      list.append(a);
    });
  }
  function renderFaqs() {
    const root=$("#faq-list");root.replaceChildren();$("#faq-count").textContent=data.faqs.length+" answers";
    if(!data.faqs.length){root.innerHTML='<p class="empty-state">No FAQs published yet.</p>';return;}
    data.faqs.forEach(f=>{
      const d=document.createElement("details");d.className="faq-item";
      const s=document.createElement("summary");s.innerHTML='<span class="faq-qmark">?</span><span>'+esc(f.question)+'</span>';
      const a=document.createElement("div");a.className="faq-answer";a.textContent=f.answer;
      d.append(s,a);root.append(d);
    });
  }
  function renderQuickLinks() {
    const root=$("#quick-links-list");root.replaceChildren();
    if(!data.quickLinks.length){root.innerHTML='<p class="empty-state">No quick links published yet.</p>';return;}
    data.quickLinks.forEach(l=>{
      const a=document.createElement("a");a.className="quick-link";a.href=safeHref(l.url);
      if(/^https?:/i.test(l.url||"")){a.target="_blank";a.rel="noopener noreferrer";}
      a.innerHTML='<span class="quick-link-icon" aria-hidden="true">'+esc(l.icon||"↗")+'</span><span class="quick-link-copy"><strong>'+esc(l.title)+'</strong><small>'+esc(l.description||l.url||"")+'</small></span><span class="quick-link-arrow" aria-hidden="true">↗</span>';
      root.append(a);
    });
  }
  // Small Markdown renderer for headings, paragraphs, lists, quotes, links, inline code and emphasis.
  // For untrusted community contributions, replace with a maintained sanitizer + Markdown parser.
  function inlineMarkdown(s) {
    return esc(s).replace(/`([^`]+)`/g,"<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }
  function markdownToHtml(md) {
    const lines=String(md||"").replace(/\r/g,"").split("\n");let html="",para=[],list=null;
    const flushPara=()=>{if(para.length){html+="<p>"+inlineMarkdown(para.join(" "))+"</p>";para=[];}};
    const closeList=()=>{if(list){html+="</"+list+">";list=null;}};
    for(const line of lines){
      if(!line.trim()){flushPara();closeList();continue;}
      const h=line.match(/^(#{1,4})\s+(.+)$/);
      if(h){flushPara();closeList();const n=h[1].length;html+="<h"+n+">"+inlineMarkdown(h[2])+"</h"+n+">";continue;}
      const li=line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);
      if(li){flushPara();const kind=/^\d/.test(li[1])?"ol":"ul";if(list!==kind){closeList();list=kind;html+="<"+list+">";}html+="<li>"+inlineMarkdown(li[2])+"</li>";continue;}
      if(line.startsWith("> ")){flushPara();closeList();html+="<blockquote>"+inlineMarkdown(line.slice(2))+"</blockquote>";continue;}
      closeList();para.push(line.trim());
    }
    flushPara();closeList();return html;
  }
  function renderArticle(slug) {
    const m=data.manuals.find(x=>x.slug===slug);
    if(!m){location.hash="#manuals";return;}
    const main=$("#main");main.innerHTML='<section class="page-section"><button class="back-button" id="back-home">← Back to documentation</button><article class="reader"><p class="eyebrow light-eyebrow">'+esc(m.category||"USER MANUAL")+'</p><h1>'+esc(m.title)+'</h1><p class="reader-meta">'+(m.updated?"Updated "+esc(m.updated)+" · ":"")+"User manual</p><div class="reader-body">'+markdownToHtml(m.body||"")+'</div><hr><p class="reader-feedback">Was this guide helpful? <a href="mailto:support@example.com?subject=Documentation%20feedback">Send feedback</a></p></article></section>';
    $("#back-home").addEventListener("click",()=>{location.hash="";});
  }
  function doSearch(query) {
    const q=query.trim().toLowerCase();const section=$("#search-results-section"),root=$("#search-results");
    if(!q){section.hidden=true;return;}
    const results=allSearchable().filter(x=>x.searchText.toLowerCase().includes(q));
    $("#search-results-title").textContent='Search results for “'+query.trim()+'”';
    $("#search-results-count").textContent=results.length+" result"+(results.length===1?"":"s");
    root.replaceChildren();
    results.forEach(r=>{
      if(r.type==="manual")root.append(renderManualCard(r));
      else {const d=document.createElement("article");d.className="doc-card";d.innerHTML='<div class="card-topline"><span class="doc-icon">?</span><span class="doc-category">FAQ</span></div><h3 class="doc-title">'+esc(r.question)+'</h3><p class="doc-description">'+esc(r.answer)+'</p><div class="doc-card-footer"><span>'+esc(r.category||"Frequently asked question")+'</span><a class="doc-open" href="#faqs">View FAQs →</a></div>';root.append(d);}
    });
    if(!results.length)root.innerHTML='<p class="empty-state">No matches found. Try another keyword or browse the manuals and FAQs below.</p>';
    section.hidden=false;
  }
  async function loadRemote() {
    if(SAMPLE_MODE || CONTENT_BASE.includes("YOUR-USERNAME")) return;
    try {
      const response=await fetch(CONTENT_BASE+"/index.json",{cache:"no-store"});
      if(!response.ok)throw new Error("Could not load content index");
      const index=await response.json();
      const read=async path=>{const r=await fetch(CONTENT_BASE+"/"+path);if(!r.ok)throw new Error("Content not found: "+path);return r.text();};
      const manuals=await Promise.all((index.manuals||[]).map(async m=>({...m,body:await read("manuals/"+m.file)})));
      const faqs=await Promise.all((index.faqFiles||[]).map(async file=>JSON.parse(await read("faqs/"+file))));
      const links=JSON.parse(await read("quick-links/links.json"));
      data={manuals,faqs:faqs.flat(),quickLinks:links.quickLinks||[],settings:index.settings||{}};
      renderManuals();renderFaqs();renderQuickLinks();
    } catch(err) {
      console.error(err);
      const n=document.createElement("p");n.className="notice";n.textContent="Documentation content could not be loaded. Check the content repository URL and index.json.";$("#manuals").prepend(n);
    }
  }
  function initTheme(){
    const saved=localStorage.getItem("docshub-theme");
    if(saved==="dark"||saved==="light")document.documentElement.dataset.theme=saved;
    $("#theme-toggle").addEventListener("click",()=>{
      const next=document.documentElement.dataset.theme==="dark"?"light":"dark";
      document.documentElement.dataset.theme=next;localStorage.setItem("docshub-theme",next);
    });
  }
  $("#search-form").addEventListener("submit",e=>{e.preventDefault();doSearch($("#site-search").value);$("#search-results-section").scrollIntoView({behavior:"smooth"});});
  $("#site-search").addEventListener("input",e=>{if(e.target.value.trim().length>=2)doSearch(e.target.value);else $("#search-results-section").hidden=true;});
  $("#clear-search").addEventListener("click",()=>{$("#site-search").value="";$("#search-results-section").hidden=true;$("#site-search").focus();});
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#site-search").focus();}if(e.key==="Escape"){$("#site-search").blur();}});
  $("#menu-toggle").addEventListener("click",()=>{const nav=$(".top-nav");const open=nav.classList.toggle("open");$("#menu-toggle").setAttribute("aria-expanded",String(open));});
  $(".top-nav").addEventListener("click",e=>{if(e.target.closest("a"))$(".top-nav").classList.remove("open");});
  window.addEventListener("hashchange",()=>{const match=location.hash.match(/^#manual\/(.+)$/);if(match)renderArticle(decodeURIComponent(match[1]));else if(!$("#featured-manuals").isConnected)location.reload();});
  $("#year").textContent=new Date().getFullYear();
  initTheme();renderManuals();renderFaqs();renderQuickLinks();loadRemote();
  if(location.hash.startsWith("#manual/")){const m=location.hash.match(/^#manual\/(.+)$/);if(m)renderArticle(decodeURIComponent(m[1]));}
})();
