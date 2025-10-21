// Enhance Unsplash images with srcset/sizes at runtime
(function(){
  if (window.__dcRespImgLoaded) return; window.__dcRespImgLoaded = true;
  function buildSrcSet(base){
    var qs = base.includes('?')?'&':'?';
    var widths=[320,480,640,800,1024,1280];
    return widths.map(function(w){return base+qs+'w='+w+'&fit=crop&auto=format '+w+'w';}).join(', ');
  }
  document.addEventListener('DOMContentLoaded', function(){
    var imgs = Array.from(document.querySelectorAll('img[src*="images.unsplash.com/"]'));
    imgs.forEach(function(img){
      if (!img.srcset) { img.srcset = buildSrcSet(img.src.split('?')[0]); }
      if (!img.sizes) { img.sizes = '(max-width: 768px) 100vw, 600px'; }
      // Prefer AVIF/WebP if supported via <picture> fallback
      if (!img.closest('picture')){
        var p = document.createElement('picture');
        var avif = document.createElement('source'); avif.type='image/avif'; avif.srcset = img.src.replace('auto=format','auto=format&fm=avif');
        var webp = document.createElement('source'); webp.type='image/webp'; webp.srcset = img.src.replace('auto=format','auto=format&fm=webp');
        img.parentNode.insertBefore(p, img); p.appendChild(avif); p.appendChild(webp); p.appendChild(img);
      }
      img.loading = img.loading || 'lazy';
      img.decoding = img.decoding || 'async';
    });
  });
})();



