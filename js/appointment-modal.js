// Appointment Modal: lightweight, WhatsApp handoff
(function(){
  if (window.__dcAppointmentLoaded) return; window.__dcAppointmentLoaded = true;
  function el(t, cls){ var e=document.createElement(t); if(cls) e.className=cls; return e; }
  const wrap = el('div','appt-modal');
  wrap.innerHTML = '\n<div class="appt-backdrop" data-close></div>\n<div class="appt-card" role="dialog" aria-label="Randevu Oluştur">\n  <button class="appt-close" data-close aria-label="Kapat">×</button>\n  <h3>Hızlı Randevu</h3>\n  <form id="apptForm">\n    <label>Ad Soyad<input name="name" required></label>\n    <label>Telefon<input name="phone" required placeholder="05xx xxx xx xx"></label>\n    <label>Hizmet<select name="service" required>\n      <option value="Dinamo Tamiri">Dinamo Tamiri</option>\n      <option value="Alternatör Servisi">Alternatör Servisi</option>\n      <option value="Marş Motoru">Marş Motoru</option>\n      <option value="Genel Elektrik">Genel Elektrik</option>\n    </select></label>\n    <label>Tarih<input type="date" name="date"></label>\n    <button type="submit" class="appt-submit">WhatsApp ile Gönder</button>\n  </form>\n</div>';

  function open(){ document.body.appendChild(wrap); document.body.style.overflow='hidden'; }
  function close(){ if(wrap.parentNode){ wrap.parentNode.removeChild(wrap); document.body.style.overflow=''; }}

  document.addEventListener('click', function(e){ if(e.target && e.target.matches('[data-open-appt]')){ e.preventDefault(); open(); }});
  wrap.addEventListener('click', function(e){ if(e.target.hasAttribute('data-close')) close(); });
  wrap.querySelector('#apptForm').addEventListener('submit', function(e){
    e.preventDefault();
    var fd = new FormData(this);
    var name = (fd.get('name')||'').trim();
    var phone = (fd.get('phone')||'').replace(/\s/g,'');
    var service = fd.get('service')||'';
    var date = fd.get('date')||'';
    if(!name || !phone || !service){ alert('Lütfen zorunlu alanları doldurun.'); return; }
    var msg = '🏁 *DC TEKNİK - Randevu Talebi*\n\n' +
              '👤 *İsim:* ' + name + '\n' +
              '📞 *Telefon:* ' + phone + '\n' +
              '🔧 *Hizmet:* ' + service + '\n' +
              (date?('📅 *Tarih:* '+date+'\n'):'') + '\n' +
              '—\nBu talep dctenık.com üzerinden gönderildi.';
    var url = 'https://wa.me/905353562469?text=' + encodeURIComponent(msg);
    window.open(url,'_blank');
    close();
  });

  // styles
  const s=document.createElement('style');
  s.textContent = '\n.appt-modal{position:fixed;inset:0;z-index:1400}'+
    '.appt-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.6)}'+
    '.appt-card{position:relative;max-width:420px;margin:10vh auto;background:#0b1220;color:#e2e8f0;border-radius:16px;padding:20px;box-shadow:0 30px 80px rgba(0,0,0,.5)}'+
    '.appt-close{position:absolute;top:10px;right:10px;border:none;background:#0b5cff;color:#fff;width:34px;height:34px;border-radius:9999px;cursor:pointer}'+
    '.appt-card h3{margin:0 0 12px;font-size:20px}'+
    '.appt-card label{display:block;font-size:14px;margin:10px 0}'+
    '.appt-card input,.appt-card select{width:100%;padding:10px;border-radius:10px;border:1px solid #1f2937;background:#111827;color:#e5e7eb}'+
    '.appt-submit{margin-top:12px;width:100%;padding:12px 16px;border:none;border-radius:10px;background:#22c55e;color:#0b1220;font-weight:800;cursor:pointer}';
  document.head.appendChild(s);

  // expose to CTA
  document.addEventListener('DOMContentLoaded', function(){
    // no-op, listeners bound
  });
})();


