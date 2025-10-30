// Lightweight SPA nav and animation for academic homepage

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if(navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }

  // SPA Nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e){
      const target = this.getAttribute('href').replace('#','');
      if (['home','papers','about'].includes(target)) {
        e.preventDefault();
        goToSection(target, this);
      }
    });
  });

  // Hero Papers CTA
  const heroCta = document.querySelector('.cta-link');
  if(heroCta) heroCta.addEventListener('click', () => goToSection('papers', document.querySelector('.nav-link[href="#papers"]')));

  // Ripple animation for glass buttons
  function glassRipple(e) {
    const btn = e.currentTarget;
    let ripple = btn.querySelector('.ripple');
    if (ripple) ripple.remove();
    ripple = document.createElement('span');
    ripple.className = 'ripple';
    btn.appendChild(ripple);
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    setTimeout(()=>ripple.remove(),490);
  }
  document.querySelectorAll('.read-pdf-btn, .linkedin-btn').forEach(btn => {
    btn.addEventListener('click', glassRipple);
    btn.addEventListener('keydown', function(e){ if(e.key === 'Enter') glassRipple(e); });
  });

  // Section transitions
  function goToSection(id, navElm) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    const section = document.getElementById(id);
    if(section){
      section.style.display = 'block';
      section.classList.add('fade-in');
      setTimeout(()=> section.classList.remove('fade-in'), 900);
      section.setAttribute('tabindex','-1');
      section.focus();
      window.scrollTo({top:0,behavior:'smooth'});
    }
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if(navElm) navElm.classList.add('active');
    if(navLinks) navLinks.classList.remove('open');
    announceSection(id);
    handleAnimationsInit();
  }

  // Accessibility: ARIA live for SPA
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live','polite');
  announcer.setAttribute('style','position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;');
  document.body.appendChild(announcer);
  function announceSection(id) {
    const readable = {home:'Home', papers:'Papers', about:'About'};
    announcer.textContent = readable[id] + ' section loaded';
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }
  })

  // Fade on scroll
  function handleAnimationsInit() {
    const fadeEls = document.querySelectorAll('.fade-in-delayed, .fade-in-footer');
    fadeEls.forEach(el => el.classList.remove('fade-in'));
    window.requestAnimationFrame(()=>{
      fadeEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 40) {
          el.classList.add('fade-in')
        }
      });
    });
  }
  window.addEventListener('scroll', handleAnimationsInit);
  handleAnimationsInit();

  // Startup: show only home
  goToSection('home', document.querySelector('.nav-link[href="#home"]'));
});

// Ripple effect CSS
const style = document.createElement('style');
style.innerHTML = `.ripple {
  position:absolute; border-radius:99em; opacity:0.39; pointer-events:none; background:radial-gradient(circle,#a482fe88 30%,transparent 75%); transform:scale(.7); animation:rippleglass .57s cubic-bezier(.3,.61,.4,1.09); z-index:5;
}
@keyframes rippleglass{0%{opacity:.26;transform:scale(.4)}65%{opacity:.22;transform:scale(1.09);}100%{opacity:0;transform:scale(1.27);}}
}`;
document.head.appendChild(style);
