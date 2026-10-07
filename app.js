const SUPABASE_URL='https://zhrwjlcdvvxohfqykjaq.supabase.co';
const SUPABASE_KEY='sb_publishable_3_A3BtiB_Qx09FlqFKnEgg_ugjSzQNP';
async function api(table, params=''){
 const r=await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
 if(!r.ok) throw new Error(await r.text()); return r.json();
}
async function loadPortfolio(){
 const root=document.querySelector('[data-portfolio]'); if(!root)return;
 try{const rows=await api('portfolio','select=*&published=eq.true&order=sort_order.asc,created_at.desc');
 root.innerHTML=rows.map(x=>`<article class="service-card"><img src="${x.cover_url||'img/design.jpg'}" alt="${x.title}"><h3>${x.title}</h3><p><strong>ขอบเขตงาน :</strong> ${x.scope||'-'}</p>${x.category?'<span class="tag">'+x.category+'</span>':''}</article>`).join('');
 const c=document.querySelector('[data-project-count]');if(c)c.textContent=rows.length+'+';
 }catch(e){root.innerHTML='<p>กำลังปรับปรุงข้อมูลผลงาน</p>'}
}
async function loadPricing(){const root=document.querySelector('[data-pricing]');if(!root)return;try{const rows=await api('pricing','select=*&published=eq.true&order=sort_order.asc');root.innerHTML=rows.map((x,i)=>`<tr><td>${i+1}</td><td class="service-col">${x.service}</td><td>${x.starting_price||'-'}</td><td>${x.unit_price||'-'}</td></tr>`).join('')}catch(e){}}
async function loadServices(){const root=document.querySelector('[data-services]');if(!root)return;try{const rows=await api('services','select=*&published=eq.true&order=sort_order.asc');root.innerHTML=rows.map(x=>`<article class="service-card"><img src="${x.image_url||'img/design.jpg'}" alt="${x.title}"><h3>${x.title}</h3><p>${x.description||''}</p></article>`).join('')}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{loadPortfolio();loadPricing();loadServices()});
async function loadSiteSettings(){try{const rows=await api('site_settings','select=*');const s=Object.fromEntries(rows.map(x=>[x.key,x.value||'']));document.querySelectorAll('[data-setting]').forEach(el=>{const v=s[el.dataset.setting];if(!v)return;if(el.tagName==='IMG')el.src=v;else if(el.tagName==='A')el.href=v;else el.textContent=v});const hero=document.querySelector('.hero-pro');if(hero&&s.hero_image_url)hero.style.backgroundImage='linear-gradient(90deg,rgba(10,20,21,.92),rgba(13,25,25,.55)),url("'+s.hero_image_url+'")';document.querySelectorAll('.logo').forEach(el=>{if(s.logo_url)el.innerHTML='<img class="brand-logo-img" src="'+s.logo_url+'" alt="BANLANG">'})}catch(e){}}
document.addEventListener('DOMContentLoaded',loadSiteSettings);
