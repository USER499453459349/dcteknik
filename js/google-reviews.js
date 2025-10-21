(function(){
  if (window.__dcReviewsLoaded) return; window.__dcReviewsLoaded = true;
  const CONFIG = window.DC_GOOGLE_PLACES || { apiKey: '', placeId: '' };
  if (!CONFIG.apiKey || !CONFIG.placeId) return; // not configured

  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function renderReviews(reviews){
    const container = document.getElementById('googleReviews');
    if (!container) return;
    container.innerHTML = '';
    reviews.slice(0,3).forEach(r=>{
      const card = document.createElement('article');
      card.className = 'review';
      card.innerHTML = `<p>${r.text || ''}</p><span>${'★'.repeat(r.rating||5)}</span><small>— ${r.author_name||'Kullanıcı'}</small>`;
      container.appendChild(card);
    });
  }

  async function init(){
    await loadScript(`https://maps.googleapis.com/maps/api/js?key=${CONFIG.apiKey}&libraries=places`);
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: CONFIG.placeId, fields: ['rating','reviews','user_ratings_total'] }, (place, status)=>{
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews){ renderReviews(place.reviews); }
    });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
