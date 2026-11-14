const CFG={
  date:'2026-11-29',   // NGÀY SỰ KIỆN (năm-tháng-ngày): đổi ở đây, cả trang tự cập nhật
  email:'aphroditeclinic@gmail.com',
  endpoint:'https://script.google.com/macros/s/AKfycbztvAsARbFb1-2LbSKYRWUqUvJdfB8CdmBfWCkNnCxm9C41KfjgPuiBBxF0o63xPCCj/exec'
};
const $=s=>document.querySelector(s),root=document.documentElement,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const pad=n=>String(n).padStart(2,'0');
// ngày sự kiện -> toàn bộ trang
const D=new Date(CFG.date+'T09:00:00'),dd=D.getDate(),mm=D.getMonth()+1,yy=D.getFullYear();
const WD=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][D.getDay()],dstr=`${pad(dd)}.${pad(mm)}.${yy}`;
$('#day').dataset.to=dd;$('#day').textContent=pad(dd);$('#mo').textContent=`Tháng ${mm} · ${yy}`;$('#wd').textContent=WD;
document.querySelectorAll('.dtx').forEach(e=>e.textContent=dstr);
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');
  t.querySelectorAll('.ln').forEach(l=>l.classList.add('in'));
  if(t.id==='day')count(t);io.unobserve(t)}),{threshold:.3,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.rule,.hl,h2').forEach(el=>io.observe(el));
function count(el){const to=+el.dataset.to,t0=performance.now();
  (function f(t){const k=Math.min((t-t0)/1600,1);el.textContent=pad(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)})(t0)}
// scroll liền mạch: một vòng rAF duy nhất, chỉ ghi transform/opacity, không đọc layout khi đang cuộn
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fx=$('.fx'),rail=$('.rail'),hero=$('.hero'),phEl=$('.ph'),tl=$('.tl');
const S={p:0,pp:0,ph:0,tp:0},T={p:0,pp:0,ph:0,tp:0};
let H=innerHeight,W=innerWidth,docH=0,phTop=0,tlTop=0,tlH=1,raf=0,last=0;
const absTop=el=>{let y=0;for(;el;el=el.offsetParent)y+=el.offsetTop;return y};
function layout(){H=innerHeight;W=innerWidth;docH=root.scrollHeight-H;phTop=absTop(phEl);tlTop=absTop(tl);tlH=tl.offsetHeight||1;measure()}
function measure(){const y=scrollY;
  T.p=y/H;T.pp=docH>0?clamp(y/docH):0;
  T.ph=clamp((y+H*.95-phTop)/(H*.55));T.tp=clamp((y+H*.72-tlTop)/tlH);
  if(!raf){last=0;raf=requestAnimationFrame(step)}}
function step(t){raf=0;const dt=last?Math.min(t-last,50):16.7;last=t;
  const a=RM?1:1-Math.pow(.9,dt/16.67);let busy=false;   // mượt như nhau trên màn 60Hz và 120Hz
  for(const k in S){const d=T[k]-S[k];if(Math.abs(d)<.0005)S[k]=T[k];else{S[k]+=d*a;busy=true}}
  const p=S.p.toFixed(4),pp=S.pp.toFixed(4);
  fx.style.setProperty('--p',p);fx.style.setProperty('--pp',pp);rail.style.setProperty('--pp',pp);
  if(S.p<1.6)hero.style.setProperty('--p',p);
  phEl.style.setProperty('--ph',S.ph.toFixed(4));tl.style.setProperty('--tp',S.tp.toFixed(4));
  if(busy)raf=requestAnimationFrame(step);else last=0}
addEventListener('scroll',measure,{passive:true});
// thanh địa chỉ trên điện thoại co/giãn làm đổi chiều cao: bỏ qua, chỉ đo lại khi đổi chiều rộng hoặc xoay màn hình
addEventListener('resize',()=>{if(innerWidth!==W||Math.abs(innerHeight-H)>150)layout()});
addEventListener('orientationchange',()=>setTimeout(layout,300));
addEventListener('load',layout);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
layout();
// xác nhận tham dự
const dlg=$('#dlg'),isUrl=CFG.endpoint.startsWith('https');
// trình duyệt cũ (iOS < 15.4, WebView Zalo/Facebook...) không có <dialog>: dùng bản thay thế
if(typeof dlg.showModal!=='function'){dlg.classList.add('pf');
  dlg.showModal=()=>{dlg.setAttribute('open','');document.body.classList.add('lock')};
  dlg.close=()=>{dlg.removeAttribute('open');document.body.classList.remove('lock')}}
dlg.addEventListener('focusin',e=>{if(e.target.matches('input,select'))setTimeout(()=>e.target.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'}),300)});
$('#rsvp').onclick=()=>dlg.showModal();
['#cl','#cl2'].forEach(s=>$(s).onclick=()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
// gửi dữ liệu: đọc được phản hồi thật từ Apps Script; chống gửi trùng bằng mã id
async function send(d){
  const opt={method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)};
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),25000);
  try{
    let r;
    try{r=await fetch(CFG.endpoint,{...opt,signal:ac.signal})}
    catch(e){if(e.name==='AbortError')throw e;
      // trình duyệt chặn đọc phản hồi: gửi lại ở chế độ no-cors (server bỏ qua bản trùng nhờ id)
      await fetch(CFG.endpoint,{...opt,mode:'no-cors',signal:ac.signal});return}
    let j=null;try{j=await r.json()}catch(_){}
    if(!r.ok||!j||j.ok!==true)throw new Error((j&&j.error)||'Máy chủ trả về lỗi');
  }finally{clearTimeout(to)}
}
let sending=false;
$('#f').onsubmit=async e=>{e.preventDefault();if(sending)return;
  const b=$('#f button[type=submit]'),d={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name:$('#n').value.trim(),phone:$('#ph').value.trim(),guests:$('#g').value,event:`Lễ ra mắt phòng khám thẩm mỹ da - 9:00-12:00 ngày ${pad(dd)}/${pad(mm)}/${yy}`};
  sending=true;b.disabled=true;b.textContent='Đang gửi…';$('#err').hidden=true;
  try{
    if(isUrl)await send(d);
    $('#nm').textContent=d.name||'Quý khách';dlg.classList.add('done');
    const r=$('#rsvp');r.textContent='Đã xác nhận tham dự ✓';r.disabled=true;
    if(!isUrl&&CFG.email)location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent('Xác nhận tham dự - '+d.event)+'&body='+encodeURIComponent(`Họ và tên: ${d.name}\nSố điện thoại: ${d.phone}\nSố khách: ${d.guests}`);
  }catch(err){console.error('RSVP lỗi:',err);b.disabled=false;b.textContent='Gửi xác nhận';$('#err').hidden=false}
  sending=false};
