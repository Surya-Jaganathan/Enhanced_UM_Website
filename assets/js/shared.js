(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function markdownToHtml(md){
  const lines=String(md||"").replace(/\r/g,"").split("\n");let out="",para=[],list=null;
  const inline=s=>escapeHtml(s)
    .replace(/`([^`]+)`/g,"<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g,"<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const flush=()=>{if(para.length){out+="<p>"+inline(para.join(" "))+"</p>";para=[];}};
  const close=()=>{if(list){out+="</"+list+">";list=null;}};
  for(const line of lines){
    if(!line.trim()){flush();close();continue;}
    let h=line.match(/^(#{1,4})\s+(.+)$/);
    if(h){flush();close();let n=h[1].length;out+=`<h${n}>${inline(h[2])}</h${n}>`;continue;}
    let li=line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);
    if(li){flush();let kind=/^\d/.test(li[1])?"ol":"ul";if(list!==kind){close();list=kind;out+="<"+list+">";}out+="<li>"+inline(li[2])+"</li>";continue;}
    if(line.startsWith("> ")){flush();close();out+="<blockquote>"+inline(line.slice(2))+"</blockquote>";continue;}
    close();para.push(line.trim());
  }flush();close();return out;
}
const DEFAULT_DATA={
 manuals:[
  {id:"sample-getting-started",title:"Getting started",category:"Getting started",description:"Learn the essentials and find your way around the product.",url:"",markdown:"# Getting started\n\nWelcome to the DocsHub user manual.\n\n## Before you begin\n\n- Review the product requirements.\n- Keep the product details nearby.\n\n## First steps\n\n1. Open the product.\n2. Follow the setup instructions provided by your team.\n3. Review the troubleshooting FAQ if you need help.",updated:"2026-10-13"},
  {id:"sample-troubleshooting",title:"Troubleshooting guide",category:"Troubleshooting",description:"Check common issues and recommended next steps.",url:"",markdown:"# Troubleshooting guide\n\n## Before contacting support\n\n1. Record the exact error message.\n2. Note the product and version.\n3. List the steps you have already tried.\n\nContact support if the issue continues.",updated:"2026-10-13"}
 ],
 faqs:[
  {id:"sample-faq-1",question:"Where can I find the latest user manual?",answer:"Browse the User manuals section above. The latest approved guide should be linked there.",category:"Documentation"},
  {id:"sample-faq-2",question:"How do I report a problem?",answer:"Include the product name, version, exact error message, and steps to reproduce the issue.",category:"Support"}
 ],
 settings:{supportEmail:"support@example.com"}
};
const STORE_KEY="docshub-admin-customer-v1";
function getData(){try{const raw=localStorage.getItem(STORE_KEY);if(!raw)return structuredClone(DEFAULT_DATA);const d=JSON.parse(raw);if(!d||!Array.isArray(d.manuals)||!Array.isArray(d.faqs))throw Error("Saved data has an unexpected format.");return d;}catch(e){console.error(e);return structuredClone(DEFAULT_DATA);}}
function saveData(data){try{localStorage.setItem(STORE_KEY,JSON.stringify(data));return true;}catch(e){throw new Error("Could not save data in this browser. Check available storage space or browser privacy settings.");}}
function uniqueId(){return "item-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);}
function normalizeUrl(url){return String(url||"").trim().replace(/#.*$/,"").replace(/\/+$/,"");}
function looksLikeMarkdownUrl(value){
 try{const u=new URL(value);if(!["https:","http:"].includes(u.protocol))return false;return /(^|\.)raw\.githubusercontent\.com$/i.test(u.hostname)||(/(^|\.)github\.com$/i.test(u.hostname)&&/\/blob\//.test(u.pathname))||/\.md$/i.test(u.pathname);}
 catch{return false;}
}
function githubBlobToRaw(value){
 try{const u=new URL(value);if(u.hostname==="github.com"&&u.pathname.includes("/blob/")){u.hostname="raw.githubusercontent.com";u.pathname=u.pathname.replace("/blob/","/");u.search="";u.hash="";return u.toString();}}catch{}return value;
}
async function loadMarkdownUrl(url){
 const fetchUrl=githubBlobToRaw(url);
 const response=await fetch(fetchUrl,{headers:{Accept:"text/plain"},cache:"no-store"});
 if(!response.ok)throw new Error("Could not load Markdown (HTTP "+response.status+"). Check that the repository and file are public and the URL points to an existing .md file.");
 const text=await response.text();
 if(text.trim().startsWith("<!DOCTYPE html")||text.includes("<html"))throw new Error("This link returned an HTML page, not raw Markdown. Use the raw.githubusercontent.com URL or a GitHub file URL ending in /blob/.");
 if(!text.trim())throw new Error("The Markdown file is empty.");
 return text;
}
window.DocsHub={ $,escapeHtml,markdownToHtml,DEFAULT_DATA,getData,saveData,uniqueId,normalizeUrl,looksLikeMarkdownUrl,githubBlobToRaw,loadMarkdownUrl,STORE_KEY };
document.addEventListener("DOMContentLoaded",()=>{
 const saved=localStorage.getItem("docshub-theme");if(saved==="dark"||saved==="light")document.documentElement.dataset.theme=saved;
 const toggle=$("#theme-toggle");if(toggle)toggle.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("docshub-theme",next);});
 const menu=$("#menu-btn");if(menu)menu.addEventListener("click",()=>$(".nav")?.classList.toggle("open"));
 const year=$("#year");if(year)year.textContent=new Date().getFullYear();
});
