document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL ───
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── HAMBURGER ───
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ─── SERVICES TABS ───
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── HOURS STATUS ───
  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0=Sunday
    const hour = now.getHours();
    const min = now.getMinutes();
    const currentMin = hour * 60 + min;

    // Horarios: Lunes-Sábado 9:00-20:00, Domingo cerrado
    const schedule = {
      0: null,           // Domingo - cerrado
      1: [540, 1200],    // Lunes 9:00-20:00
      2: [540, 1200],    // Martes
      3: [540, 1200],    // Miércoles
      4: [540, 1200],    // Jueves
      5: [540, 1200],    // Viernes
      6: [540, 1200],    // Sábado
    };

    const todaySchedule = schedule[day];
    const dot = document.querySelector('.status-dot');
    const text = document.querySelector('.status-text');
    const nextOpen = document.querySelector('.next-open');

    if (!dot) return;

    if (todaySchedule && currentMin >= todaySchedule[0] && currentMin < todaySchedule[1]) {
      dot.className = 'status-dot open';
      text.className = 'status-text open';
      text.textContent = '¡Abierto Ahora!';
      const closeH = Math.floor(todaySchedule[1] / 60);
      const closeM = todaySchedule[1] % 60;
      nextOpen.textContent = `Cerramos a las ${closeH}:${String(closeM).padStart(2,'0')}`;
    } else {
      dot.className = 'status-dot closed';
      text.className = 'status-text closed';
      text.textContent = 'Cerrado';
      // Find next open
      let nextDay = day;
      let tries = 0;
      do {
        nextDay = (nextDay + 1) % 7;
        tries++;
      } while (!schedule[nextDay] && tries < 7);

      if (todaySchedule && currentMin < todaySchedule[0]) {
        nextOpen.textContent = 'Abrimos hoy a las 9:00';
      } else if (schedule[nextDay]) {
        const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        nextOpen.textContent = `Abrimos el ${days[nextDay]} a las 9:00`;
      }
    }

    // Highlight today in table
    const rows = document.querySelectorAll('.hours-table tr');
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun=6th row, Mon=0th row
    rows.forEach(r => r.classList.remove('today'));
    if (rows[dayMap[day]]) rows[dayMap[day]].classList.add('today');
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));

  // ─── SMOOTH SCROLL FOR NAV ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
