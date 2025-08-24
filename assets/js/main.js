// Main JavaScript functionality for gutmandesign.co
class PortfolioApp {
  constructor() {
    this.theme = this.getStoredTheme() || 'light';
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    this.setupAnimations();
  }

  // Dark mode management
  setupTheme() {
    this.applyTheme(this.theme);
    this.createThemeToggle();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    this.setStoredTheme(theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.updateToggleIcon();
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = this.getToggleIcon();
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.addEventListener('click', () => this.toggleTheme());
    
    document.body.appendChild(toggle);
  }

  getToggleIcon() {
    return this.theme === 'light' ? '🌙' : '☀️';
  }

  updateToggleIcon() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.innerHTML = this.getToggleIcon();
    }
  }

  // Mobile navigation toggle
  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        navToggle.classList.toggle('active');
      });

      // Close mobile menu when clicking on a link
      const links = navLinks.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('nav-open');
          navToggle.classList.remove('active');
        });
      });
    }

    // Add scroll behavior to navigation
    this.handleNavScroll();
  }

  // Handle navigation background on scroll
  handleNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;

    const updateNav = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }

      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Lazy loading for images
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Scroll-triggered animations
  setupAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe elements that should animate on scroll
      const animateElements = document.querySelectorAll('.case-study-card, .service-block, .section-title');
      animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
      });
    }
  }

  // Analytics tracking (placeholder for future implementation)
  trackEvent(eventName, properties = {}) {
    // Google Analytics 4 or other analytics implementation
    console.log('Track event:', eventName, properties);
    
    // Example for future GA4 implementation:
    // gtag('event', eventName, properties);
  }

  // Contact form handling (for future implementation)
  handleContactForm() {
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form validation and submission logic
        this.trackEvent('contact_form_submit');
        
        // Show success message
        this.showMessage('Thank you! I\'ll get back to you soon.', 'success');
      });
    });
  }

  // Utility function to show messages
  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Mobile navigation styles are now in main.css