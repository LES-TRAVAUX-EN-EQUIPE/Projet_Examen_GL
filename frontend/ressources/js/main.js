(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navGroup = document.querySelector('.nav-group');

  if (menuToggle && navGroup) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navGroup.classList.toggle('is-open');
    });

    navGroup.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navGroup.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId.length < 2) {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
