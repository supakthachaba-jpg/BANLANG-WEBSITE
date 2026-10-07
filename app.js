const SUPABASE_URL='https://zhrwjlcdvvxohfqykjaq.supabase.co';
const SUPABASE_KEY='sb_publishable_3_A3BtiB_Qx09FlqFKnEgg_ugjSzQNP';
async function api(table, params=''){
 const r=await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
 if(!r.ok) throw new Error(await r.text()); return r.json();
}
async function loadPortfolio(){
 const root=document.querySelector('[data-portfolio]'); if(!root)return;
 try{
  const [rows,imgs]=await Promise.all([
   api('portfolio','select=*&published=eq.true&order=sort_order.asc,created_at.desc'),
   api('portfolio_images','select=id,project_id,image_url,sort_order&order=sort_order.asc')
  ]);
  const cats=[...new Set(rows.map(x=>x.category).filter(Boolean))];
  root.innerHTML='<div class="portfolio-filters"><button class="active" data-cat="all">ทั้งหมด</button>'+cats.map(c=>'<button data-cat="'+escHtml(c)+'">'+escHtml(c)+'</button>').join('')+'</div><div class="portfolio-list">'+rows.map(x=>{
   const gallery=imgs.filter(i=>String(i.project_id)===String(x.id)).map(i=>i.image_url);
   if(x.cover_url&&!gallery.includes(x.cover_url))gallery.unshift(x.cover_url);
   const pics=gallery.length?gallery:['img/design.jpg'];
   return '<article class="portfolio-card" data-category="'+escHtml(x.category||'')+'"><div class="project-gallery"><button class="gallery-nav prev" aria-label="รูปก่อนหน้า">‹</button><div class="gallery-track">'+pics.map((u,i)=>'<img src="'+escHtml(u)+'" alt="'+escHtml(x.title)+' รูปที่ '+(i+1)+'" loading="lazy" onerror="this.onerror=null;this.src=\'img/design.jpg\'">').join('')+'</div><button class="gallery-nav next" aria-label="รูปถัดไป">›</button><div class="gallery-count">1 / '+pics.length+'</div></div><div class="portfolio-copy"><div class="portfolio-meta">'+(x.category?'<span class="tag">'+escHtml(x.category)+'</span>':'')+(x.year?'<span>'+x.year+'</span>':'')+'</div><h3>'+escHtml(x.title)+'</h3><p><strong>ขอบเขตงาน :</strong> '+escHtml(x.scope||'-')+'</p>'+(x.location?'<small>'+escHtml(x.location)+'</small>':'')+'</div></article>';
  }).join('')+'</div>';
  root.querySelectorAll('.portfolio-filters button').forEach(btn=>btn.onclick=()=>{root.querySelectorAll('.portfolio-filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');root.querySelectorAll('.portfolio-card').forEach(card=>card.hidden=btn.dataset.cat!=='all'&&card.dataset.category!==btn.dataset.cat)});
  root.querySelectorAll('.project-gallery').forEach(g=>{const track=g.querySelector('.gallery-track'),pics=[...track.querySelectorAll('img')],count=g.querySelector('.gallery-count');let i=0;const go=n=>{i=(n+pics.length)%pics.length;track.scrollTo({left:track.clientWidth*i,behavior:'smooth'});count.textContent=(i+1)+' / '+pics.length};g.querySelector('.prev').onclick=()=>go(i-1);g.querySelector('.next').onclick=()=>go(i+1);track.addEventListener('scroll',()=>{i=Math.round(track.scrollLeft/Math.max(1,track.clientWidth));count.textContent=(i+1)+' / '+pics.length});if(pics.length<2){g.querySelector('.prev').hidden=true;g.querySelector('.next').hidden=true;count.hidden=true}});
 }catch(e){root.innerHTML='<p>กำลังปรับปรุงข้อมูลผลงาน</p>'}
}
function escHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function loadPricing(){const root=document.querySelector('[data-pricing]');if(!root)return;try{const rows=await api('pricing','select=*&published=eq.true&order=sort_order.asc');root.innerHTML=rows.map((x,i)=>`<tr><td>${i+1}</td><td class="service-col">${x.service}</td><td>${x.starting_price||'-'}</td><td>${x.unit_price||'-'}</td></tr>`).join('')}catch(e){}}
async function loadServices(){const root=document.querySelector('[data-services]');if(!root)return;try{const rows=await api('services','select=*&published=eq.true&order=sort_order.asc');root.innerHTML=rows.map(x=>`<article class="service-card"><img src="${x.image_url||'img/design.jpg'}" alt="${x.title}"><h3>${x.title}</h3><p>${x.description||''}</p></article>`).join('')}catch(e){}}
document.addEventListener('DOMContentLoaded',()=>{loadPortfolio();loadPricing();loadServices()});
async function loadSiteSettings(){try{const rows=await api('site_settings','select=*');const s=Object.fromEntries(rows.map(x=>[x.key,x.value||'']));document.querySelectorAll('[data-setting]').forEach(el=>{const v=s[el.dataset.setting];if(!v)return;if(el.tagName==='IMG')el.src=v;else if(el.tagName==='A')el.href=v;else el.textContent=v});const hero=document.querySelector('.hero-pro');if(hero&&s.hero_image_url)hero.style.backgroundImage='linear-gradient(90deg,rgba(10,20,21,.92),rgba(13,25,25,.55)),url("'+s.hero_image_url+'")';document.querySelectorAll('.logo').forEach(el=>{if(s.logo_url)el.innerHTML='<img class="brand-logo-img" src="'+s.logo_url+'" alt="BANLANG">'})}catch(e){}}
document.addEventListener('DOMContentLoaded',loadSiteSettings);
