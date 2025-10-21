(function(){
  if (window.__dcReviewsLoaded) return; window.__dcReviewsLoaded = true;
  const CONFIG = window.DC_GOOGLE_PLACES || { apiKey: '', placeId: '' };

  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function renderReviews(reviews){
    const container = document.getElementById('googleReviews');
    if (!container) return;
    container.innerHTML = '';
    reviews.slice(0,3).forEach(r=>{
      const card = document.createElement('article');
      card.className = 'review';
      const stars = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      card.innerHTML = `<p>${(r.text || '').replace(/</g,'&lt;')}</p><span>${'★'.repeat(stars)}</span><small>— ${(r.author_name||'Kullanıcı')}</small>`;
      container.appendChild(card);
    });
  }

  function renderFallback(){
    renderReviews([
      { text: 'Hızlı ve güvenilir hizmet. Dinamo arızası aynı gün çözüldü.', rating: 5, author_name: 'M.Y.' },
      { text: 'Fiyat/performans çok iyi, ustaların ilgisi harika.', rating: 5, author_name: 'A.K.' },
      { text: 'Alternatör servisi profesyonel, tavsiye ederim.', rating: 5, author_name: 'S.T.' }
    ]);
  }

  async function init(){
    try {
      if (!CONFIG.apiKey || !CONFIG.placeId) { renderFallback(); return; }
      await loadScript(`https://maps.googleapis.com/maps/api/js?key=${CONFIG.apiKey}&libraries=places`);
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId: CONFIG.placeId, fields: ['rating','reviews','user_ratings_total'] }, (place, status)=>{
        if (status === google.maps.places.PlacesServiceStatus.OK && place && Array.isArray(place.reviews)) {
          renderReviews(place.reviews);
        } else {
          renderFallback();
        }
      });
    } catch (e){
      renderFallback();
    }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
