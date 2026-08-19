const cursorGlow = document.querySelector('.cursor-glow');
const revealTargets = document.querySelectorAll('.about-grid, .skills-heading, .skill-panel, .projects-heading, .project-card');
const projectCards = document.querySelectorAll('.project-card');
const projectGalleries = {
  'nasa-apod': [
    { src: 'images/nasapod.png', alt: 'NASA APOD project preview' }
  ],
  'format-fixer': [
    { src: 'images/first%20image.png', alt: 'Format-Fixer main project preview' },
    { src: 'images/vector(2).png', alt: 'Format-Fixer vector preview' },
    { src: 'images/pdf(3).png', alt: 'Format-Fixer PDF preview' },
    { src: 'images/png4).png', alt: 'Format-Fixer PNG preview' },
    { src: 'images/text%20sanitizer(5).png', alt: 'Format-Fixer text sanitizer preview' }
  ],
  'under-construction': [
    { src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1100&q=85', alt: 'Night sky representing the Under Construction project' },
    { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85', alt: 'Mountain landscape representing the Under Construction project' },
    { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85', alt: 'Landscape representing the Under Construction project' }
  ]
};
const galleryIndexes = new Map();

projectCards.forEach((card) => {
  const gallery = projectGalleries[card.dataset.project];
  if (gallery?.length === 1) card.querySelector('.project-gallery-controls').hidden = true;
});

const updateProjectImage = (card, direction) => {
  const gallery = projectGalleries[card.dataset.project];
  if (!gallery) return;
  const currentIndex = galleryIndexes.get(card) ?? 0;
  const nextIndex = (currentIndex + direction + gallery.length) % gallery.length;
  const image = card.querySelector('.project-thumb img');
  const count = card.querySelector('.project-gallery-count');
  galleryIndexes.set(card, nextIndex);
  image.src = gallery[nextIndex].src;
  image.alt = gallery[nextIndex].alt;
  count.textContent = `${String(nextIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
};

const closeProjectFocus = () => {
  document.body.classList.remove('project-focus-mode');
  document.querySelector('.project-card.is-focused')?.classList.remove('is-focused');
};

projectCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    const wasFocused = card.classList.contains('is-focused');
    closeProjectFocus();
    if (!wasFocused) {
      card.classList.add('is-focused');
      document.body.classList.add('project-focus-mode');
      card.focus();
    }
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.click();
    }
  });
});

document.querySelectorAll('.project-close').forEach((button) => {
  button.addEventListener('click', closeProjectFocus);
});

document.querySelectorAll('.project-gallery-prev').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    updateProjectImage(button.closest('.project-card'), -1);
  });
});

document.querySelectorAll('.project-gallery-next').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    updateProjectImage(button.closest('.project-card'), 1);
  });
});

document.addEventListener('click', (event) => {
  if (document.body.classList.contains('project-focus-mode') && !event.target.closest('.project-card.is-focused')) {
    closeProjectFocus();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProjectFocus();
});

window.addEventListener('pointermove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((target) => revealObserver.observe(target));