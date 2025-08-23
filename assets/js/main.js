// Main JavaScript functionality for gutmandesign.co
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    this.setupAnimations();
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

// Add mobile navigation styles
const mobileNavStyles = `
  @media (max-width: 767px) {
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .nav-links.nav-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .nav-toggle.active .nav-toggle-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active .nav-toggle-line:nth-child(2) {
      opacity: 0;
    }
    
    .nav-toggle.active .nav-toggle-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;

// Inject mobile navigation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileNavStyles;
document.head.appendChild(styleSheet);