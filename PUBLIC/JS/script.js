const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visivel');
        entry.target.classList.remove('invisivel');
      }, index * 250);
    } else {
      entry.target.classList.remove('visivel');
      entry.target.classList.add('invisivel');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(
  '.produto-card, .produto-card2, .produto-container, .produto-container2, .texto, .banner-doceria, .contato-section'
).forEach(el => {
  el.classList.add('invisivel');
  observer.observe(el);
});


window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;

  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 100;
    const sectionHeight = sec.offsetHeight;
    const id = sec.getAttribute('id');

    document.querySelectorAll('.menu-principal a').forEach(link => {
      link.classList.remove('ativo');
    });

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelector(`.menu-principal a[href*="#${id}"]`)?.classList.add('ativo');
    }
  });
});


const btnTopo = document.getElementById('btn-topo');

window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 300 ? 'block' : 'none';
});

btnTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
