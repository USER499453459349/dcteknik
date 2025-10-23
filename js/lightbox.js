// Minimal, dependency-free lightbox with keyboard and swipe
(function(){
  if (window.__dcLightboxLoaded) return; window.__dcLightboxLoaded = true;
  const overlay = document.createElement('div');
  overlay.className = 'dc-lightbox-overlay';
  overlay.innerHTML = '<button class="dc-lb-close" aria-label="Kapat">×</button><img class="dc-lb-img" alt="">';
  const imgEl = overlay.querySelector('.dc-lb-img');
  const btnClose = overlay.querySelector('.dc-lb-close');
  let images = [], idx = 0, startX = 0;

  function open(i){ idx = i; const el = images[idx]; if(!el) return; imgEl.src = el.dataset.lbSrc || el.src; document.body.appendChild(overlay); document.body.style.overflow='hidden'; }
  function close(){ if(overlay.parentNode){ overlay.parentNode.removeChild(overlay); document.body.style.overflow=''; } }
  function next(){ if(images.length<2) return; open((idx+1)%images.length); }
  function prev(){ if(images.length<2) return; open((idx-1+images.length)%images.length); }

  document.addEventListener('DOMContentLoaded', function(){
    images = Array.from(document.querySelectorAll('.gallery-image'));
    images.forEach((el,i)=>{ el.style.cursor='zoom-in'; el.addEventListener('click', ()=>open(i)); });
    btnClose.addEventListener('click', close);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    document.addEventListener('keydown', (e)=>{ if(!overlay.parentNode) return; if(e.key==='Escape') close(); if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });
    overlay.addEventListener('touchstart', e=>{ startX = e.changedTouches[0].clientX; }, {passive:true});
    overlay.addEventListener('touchend', e=>{ const dx = e.changedTouches[0].clientX-startX; if(Math.abs(dx)>40){ dx<0?next():prev(); } }, {passive:true});
  });
})();







