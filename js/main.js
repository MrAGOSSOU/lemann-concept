/**
 * LEMANN — Concept Digital Expérience
 * Interaction, micro-animations & gestion des réservations
 * Réalisation : Omnika Digit
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retirer no-js
  document.documentElement.classList.remove('no-js');

  /* ------------------------------------------------------------------------
     1. GESTION DU HEADER STICKY & SCROLL
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  const scrollThreshold = 60;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* ------------------------------------------------------------------------
     2. MENU MOBILE FULLSCREEN
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* ------------------------------------------------------------------------
     3. REVEAL AU SCROLL (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback si pas de support
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ------------------------------------------------------------------------
     4. MODAL RENDEZ-VOUS EN SALON
     ------------------------------------------------------------------------ */
  const rdvModal = document.getElementById('rdvModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const rdvBtns = document.querySelectorAll('.btn-open-rdv');
  const rdvServiceSelect = document.getElementById('rdvService');
  const rdvForm = document.getElementById('rdvForm');

  const openRdvModal = (serviceName = null) => {
    if (serviceName && rdvServiceSelect) {
      // Tenter de matcher l'option
      for (let i = 0; i < rdvServiceSelect.options.length; i++) {
        if (rdvServiceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
            rdvServiceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
          rdvServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    // Fermer menu mobile si ouvert
    closeMobileMenu();
    // Fermer modal collection si ouvert
    closeCollModal();

    rdvModal.classList.add('active');
    rdvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus premier champ
    const firstInput = document.getElementById('rdvName');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeRdvModal = () => {
    rdvModal.classList.remove('active');
    rdvModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  rdvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || null;
      openRdvModal(service);
    });
  });

  closeModalBtn.addEventListener('click', closeRdvModal);

  rdvModal.addEventListener('click', (e) => {
    if (e.target === rdvModal) {
      closeRdvModal();
    }
  });

  // Soumission Formulaire -> Redirection WhatsApp élégante
  rdvForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rdvName').value.trim();
    const phone = document.getElementById('rdvPhone').value.trim();
    const service = document.getElementById('rdvService').value;
    const date = document.getElementById('rdvDate').value || 'À convenir ensemble';
    const time = document.getElementById('rdvTime').value;

    const message = `Bonjour Maison Lemann, je souhaite réserver un rendez-vous privé en salon :
- Nom : ${name}
- Téléphone : ${phone}
- Service : ${service}
- Date souhaitée : ${date}
- Créneau : ${time}`;

    const whatsappUrl = `https://wa.me/22900000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    closeRdvModal();
  });

  /* ------------------------------------------------------------------------
     5. MODAL EXPLORATION DES COLLECTIONS
     ------------------------------------------------------------------------ */
  const collectionModal = document.getElementById('collectionModal');
  const closeCollModalBtn = document.getElementById('closeCollModalBtn');
  const collModalImg = document.getElementById('collModalImg');
  const collModalTag = document.getElementById('collModalTag');
  const collModalTitle = document.getElementById('collModalTitle');
  const collModalDesc = document.getElementById('collModalDesc');
  const collBtns = document.querySelectorAll('.btn-collection-modal');
  const collModalRdvBtn = document.getElementById('collModalRdvBtn');

  const collectionsData = {
    vue: {
      tag: "Optique & Précision",
      title: "Lunettes de vue Lemann",
      desc: "Une sélection rigoureuse associant verres technologiques et montures architecturales. Chaque monture est ajustée à votre morphologie avec un centrage optique de haute précision pour un confort visuel sans fatigue.",
      img: "images/optimized/collection-vue.webp",
      service: "Choix de lunettes de vue"
    },
    solaires: {
      tag: "Solaire & Allure",
      title: "Lunettes solaires Lemann",
      desc: "Des silhouettes audacieuses et protectrices, équipées de verres filtrants 100% UV et de filtres polarisés d'exception. Pensées pour affirmer votre présence sous la lumière avec une élégance intemporelle.",
      img: "images/optimized/collection-solaires.webp",
      service: "Sélection de lunettes solaires"
    },
    montures: {
      tag: "Haute Façon & Créateurs",
      title: "Montures & Pièces Signatures",
      desc: "Acétates d'exception, métaux précieux et charnières sculptées. Chaque pièce de notre sélection est une véritable œuvre de lunetterie destinée aux amateurs d'exclusivité et de design affirmé.",
      img: "images/optimized/collection-montures.webp",
      service: "Conseil personnalisé & morphologie"
    }
  };

  let currentCollectionService = null;

  const openCollModal = (key) => {
    const data = collectionsData[key];
    if (!data) return;

    collModalTag.textContent = data.tag;
    collModalTitle.textContent = data.title;
    collModalDesc.textContent = data.desc;
    collModalImg.src = data.img;
    collModalImg.alt = data.title;
    currentCollectionService = data.service;

    collectionModal.classList.add('active');
    collectionModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCollModal = () => {
    collectionModal.classList.remove('active');
    collectionModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  collBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      openCollModal(target);
    });
  });

  closeCollModalBtn.addEventListener('click', closeCollModal);

  collectionModal.addEventListener('click', (e) => {
    if (e.target === collectionModal) {
      closeCollModal();
    }
  });

  if (collModalRdvBtn) {
    collModalRdvBtn.addEventListener('click', () => {
      openRdvModal(currentCollectionService);
    });
  }

  // Échap clavier pour fermer toute modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRdvModal();
      closeCollModal();
      closeMobileMenu();
    }
  });

  /* ------------------------------------------------------------------------
     6. CURSEUR PERSONNALISÉ SUBTIL (DESKTOP)
     ------------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(animateOutline);
    };
    requestAnimationFrame(animateOutline);

    // Effet d'expansion sur liens et boutons
    const hoverables = document.querySelectorAll('a, button, .collection-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '52px';
        cursorOutline.style.height = '52px';
        cursorOutline.style.borderColor = 'rgba(200, 168, 130, 0.7)';
        cursorOutline.style.backgroundColor = 'rgba(200, 168, 130, 0.05)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '32px';
        cursorOutline.style.height = '32px';
        cursorOutline.style.borderColor = 'rgba(200, 168, 130, 0.4)';
        cursorOutline.style.backgroundColor = 'transparent';
      });
    });
  }

});
