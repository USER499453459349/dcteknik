document.addEventListener('DOMContentLoaded', function(){
  const search = document.getElementById('blogSearch');
  const chips = document.querySelectorAll('[data-blog-filter]');
  const posts = Array.from(document.querySelectorAll('.blog-post'));
  function normalize(s){ return (s||'').toLowerCase().trim(); }
  function apply(){
    const q = normalize(search && search.value);
    const active = Array.from(chips).filter(c=>c.classList.contains('active')).map(c=>c.dataset.blogFilter);
    posts.forEach(p=>{
      const text = normalize(p.textContent);
      const cat = p.querySelector('.blog-category')?.textContent || '';
      const matchQ = !q || text.includes(q);
      const matchC = !active.length || active.some(a=>normalize(cat).includes(normalize(a)));
      p.style.display = (matchQ && matchC) ? '' : 'none';
    });
  }
  if (search){ search.addEventListener('input', apply); }
  chips.forEach(c=> c.addEventListener('click', ()=>{ c.classList.toggle('active'); apply(); }));
});



