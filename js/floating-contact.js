// Floating WhatsApp and Call widget (self-contained)
(function(){
  if (window.__dcFloatingWidgetLoaded) return; 
  window.__dcFloatingWidgetLoaded = true;

  function createEl(tag, props, children){
    var el = document.createElement(tag);
    if (props) Object.keys(props).forEach(function(k){ el[k] = props[k]; });
    if (children) children.forEach(function(ch){ el.appendChild(ch); });
    return el;
  }

  var style = document.createElement('style');
  style.textContent = [
    '.dc-floating{position:fixed; right:18px; bottom:18px; z-index:9999; display:flex; flex-direction:column; gap:12px; opacity:1; visibility:visible; transition:opacity 0.3s ease, visibility 0.3s ease;}',
    '.dc-floating a{width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; box-shadow:0 10px 25px rgba(2,6,23,0.2); transition:transform .15s ease, box-shadow .15s ease; -webkit-tap-highlight-color: transparent; touch-action: manipulation;}',
    '.dc-floating a:hover{transform:translateY(-2px); box-shadow:0 14px 30px rgba(2,6,23,0.25);}',
    '.dc-floating a:active{transform:translateY(0); box-shadow:0 8px 20px rgba(2,6,23,0.3);}',
    '.dc-wa{background:#25D366; color:#fff;}',
    '.dc-call{background:#0b5cff; color:#fff;}',
    '.dc-floating svg{width:26px; height:26px; fill:currentColor; pointer-events:none;}',
    '@media (max-width: 768px) {',
    '  .dc-floating{right:16px; bottom:16px; gap:10px;}',
    '  .dc-floating a{width:52px; height:52px; min-width:52px; min-height:52px;}',
    '  .dc-floating svg{width:24px; height:24px;}',
    '}',
    '@media (max-width: 480px) {',
    '  .dc-floating{right:12px; bottom:12px; gap:8px;}',
    '  .dc-floating a{width:48px; height:48px; min-width:48px; min-height:48px;}',
    '  .dc-floating svg{width:22px; height:22px;}',
    '}',
    '@media (max-width: 360px) {',
    '  .dc-floating{right:10px; bottom:10px;}',
    '  .dc-floating a{width:44px; height:44px; min-width:44px; min-height:44px;}',
    '  .dc-floating svg{width:20px; height:20px;}',
    '}'
  ].join('');

  var wrap = createEl('div', { className: 'dc-floating' });

  var wa = createEl('a', {
    className: 'dc-wa',
    href: 'https://wa.me/905353562469?text=' + encodeURIComponent('Merhaba! Web sitenizden geliyorum. Bilgi almak istiyorum.'),
    target: '_blank',
    rel: 'noopener'
  });
  wa.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.11 17.48c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1-1.04 2.45s1.07 2.84 1.22 3.04c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.45-.07-.13-.27-.2-.57-.35z"/></svg>';

  var call = createEl('a', { className: 'dc-call', href: 'tel:+905353562469' });
  call.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C11.85 21 3 12.15 3 1a1 1 0 011-1h3.5a1 1 0 011 1c0 1.27.2 2.47.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/></svg>';

  // Widget yükleme fonksiyonu - hata kontrolü ile
  function loadFloatingWidget() {
    try {
      // Style'ı güvenli şekilde ekle
      if (document.head && !document.querySelector('style[data-dc-floating]')) {
        style.setAttribute('data-dc-floating', 'true');
        document.head.appendChild(style);
      }
      
      // Widget'ları oluştur
      if (wrap && wa && call) {
        wrap.appendChild(wa);
        wrap.appendChild(call);
      } else {
        throw new Error('Widget elementleri oluşturulamadı');
      }
      
      // Body'ye güvenli şekilde ekle
      if (document.body) {
        // Mevcut widget'ı kontrol et
        const existingWidget = document.querySelector('.dc-floating');
        if (existingWidget) {
          existingWidget.remove();
        }
        document.body.appendChild(wrap);
        
        // Widget'ın başarıyla eklendiğini kontrol et
        setTimeout(() => {
          const addedWidget = document.querySelector('.dc-floating');
          if (!addedWidget) {
            throw new Error('Widget DOM\'a eklenemedi');
          }
        }, 100);
        
      } else {
        // Body henüz hazır değilse bekle
        document.addEventListener('DOMContentLoaded', function() {
          if (document.body) {
            const existingWidget = document.querySelector('.dc-floating');
            if (existingWidget) {
              existingWidget.remove();
            }
            document.body.appendChild(wrap);
          }
        });
      }
      
      // Mobil optimizasyonları
      setupMobileOptimizations();
      
    } catch (error) {
      console.error('❌ Floating widget yükleme hatası:', error);
      // Fallback: Basit widget oluştur
      createFallbackWidget();
    }
  }

  // Mobil optimizasyonları
  function setupMobileOptimizations() {
    if (window.innerWidth <= 768) {
      // Touch event'leri optimize et
      wrap.addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });
      
      // Scroll davranışı
      let lastScrollTop = 0;
      let ticking = false;
      let isHidden = false;
      
      function updateWidgetVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isScrollingDown = scrollTop > lastScrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        // Sadece önemli scroll değişikliklerinde güncelle
        if (scrollDelta > 10) {
          if (isScrollingDown && scrollTop > 100 && !isHidden) {
            wrap.style.transform = 'translateY(80px)';
            wrap.style.opacity = '0.7';
            isHidden = true;
          } else if (!isScrollingDown && isHidden) {
            wrap.style.transform = 'translateY(0)';
            wrap.style.opacity = '1';
            isHidden = false;
          }
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
      }
      
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(updateWidgetVisibility);
          ticking = true;
        }
      }
      
      window.addEventListener('scroll', requestTick, { passive: true });
    }
  }

  // Fallback widget oluştur
  function createFallbackWidget() {
    try {
      const fallbackWidget = document.createElement('div');
      fallbackWidget.className = 'dc-floating-fallback';
      fallbackWidget.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      
      const waButton = document.createElement('a');
      waButton.href = 'https://wa.me/905353562469';
      waButton.target = '_blank';
      waButton.style.cssText = `
        width: 50px;
        height: 50px;
        background: #25D366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        font-size: 20px;
      `;
      waButton.innerHTML = '💬';
      
      const callButton = document.createElement('a');
      callButton.href = 'tel:+905353562469';
      callButton.style.cssText = `
        width: 50px;
        height: 50px;
        background: #0b5cff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        font-size: 20px;
      `;
      callButton.innerHTML = '📞';
      
      fallbackWidget.appendChild(waButton);
      fallbackWidget.appendChild(callButton);
      
      if (document.body) {
        document.body.appendChild(fallbackWidget);
      }
      
    } catch (fallbackError) {
      console.error('❌ Fallback widget oluşturulamadı:', fallbackError);
    }
  }

  // Hemen yükle veya DOM hazır olduğunda yükle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFloatingWidget);
  } else {
    loadFloatingWidget();
  }
})();









