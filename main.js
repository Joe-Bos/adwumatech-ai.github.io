import './style.css'

// GSAP-like entrance animations using basic Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Targets for animation
  const animationTargets = [
    '.hero-content .eyebrow',
    '.hero-content h1',
    '.section-header',
    '.overview-content p',
    '.project-item .project-content',
    '.project-item .project-visual'
  ]

  animationTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      observer.observe(el)
    })
  })

  // CSS for reveal
  const style = document.createElement('style')
  style.innerHTML = `
    .reveal {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `
  document.head.appendChild(style)

  // Subtle Parallax on Hero Grid
  window.addEventListener('scroll', () => {
    const grid = document.querySelector('.hero-grid')
    if (grid) {
      const scrolled = window.pageYOffset
      grid.style.transform = `translateY(${scrolled * 0.3}px)`
    }
  })

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle')
  const nav = document.querySelector('.nav')
  const header = document.querySelector('.header')

  if (menuToggle && nav && header) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active')
      header.classList.toggle('nav-open')
    })

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active')
        header.classList.remove('nav-open')
      })
    })
  }
})
