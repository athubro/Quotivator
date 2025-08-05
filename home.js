// Fade in when scrolled into view
window.addEventListener('scroll', () => {
  const mission = document.querySelector('.mission-section');
  const triggerPoint = window.innerHeight / 1.2;

  if (mission.getBoundingClientRect().top < triggerPoint) {
    mission.classList.add('show');
  }
});
