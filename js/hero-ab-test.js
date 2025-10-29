// Simple A/B test for hero CTA (phone vs appointment)
(function(){
  if (window.__heroAB) return; window.__heroAB = true;
  document.addEventListener('DOMContentLoaded', function(){
    const hero = document.querySelector('.hero-content'); if (!hero) return;
    const variant = (localStorage.getItem('hero_variant') || (Math.random() < 0.5 ? 'A' : 'B'));
    localStorage.setItem('hero_variant', variant);
    const ctaWrap = document.createElement('div'); ctaWrap.className='hero-ctas';
    const btnPrimary = document.createElement('a');
    const btnSecondary = document.createElement('a');
    btnPrimary.className='btn'; btnSecondary.className='btn';
    if (variant === 'A'){
      btnPrimary.classList.add('btn-primary'); btnPrimary.href='tel:+905353562469'; btnPrimary.textContent='📞 Hemen Ara';
      btnSecondary.classList.add('btn-secondary'); btnSecondary.href='#'; btnSecondary.setAttribute('data-open-appt',''); btnSecondary.textContent='🗓️ Randevu Al';
    } else {
      btnPrimary.classList.add('btn-primary'); btnPrimary.href='#'; btnPrimary.setAttribute('data-open-appt',''); btnPrimary.textContent='🗓️ Randevu Al';
      btnSecondary.classList.add('btn-secondary'); btnSecondary.href='tel:+905353562469'; btnSecondary.textContent='📞 Hemen Ara';
    }
    ctaWrap.appendChild(btnPrimary); ctaWrap.appendChild(btnSecondary); hero.appendChild(ctaWrap);
    // tracking
    [btnPrimary, btnSecondary].forEach((b)=> b.addEventListener('click', ()=>{
      if (typeof gtag!=='undefined' && typeof gtag === 'function'){ 
        try {
          gtag('event','hero_cta_click',{event_category:'ab',event_label:variant}); 
        } catch (error) {
          console.warn('Hero CTA analytics gönderilemedi:', error);
        }
      }
    }));
  });
})();







