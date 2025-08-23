// Password Protection for Altruist Case Study
// Simple client-side protection as outlined in planning-notes.md

class PasswordProtection {
  constructor() {
    this.password = 'current'; // Password from planning notes
    this.sessionKey = 'portfolio_access';
    this.maxAttempts = 5;
    this.attemptKey = 'password_attempts';
    this.lockoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.lockoutKey = 'lockout_time';
    
    this.init();
  }
  
  init() {
    // Check if page contains password protection
    const overlay = document.getElementById('passwordOverlay');
    if (!overlay) return;
    
    // Check if user is locked out
    if (this.isLockedOut()) {
      this.showLockoutMessage();
      return;
    }
    
    // Check if already authenticated
    if (this.isAuthenticated()) {
      this.showContent();
    } else {
      this.showPasswordForm();
    }
    
    this.setupEventListeners();
  }
  
  isAuthenticated() {
    return sessionStorage.getItem(this.sessionKey) === 'true';
  }
  
  isLockedOut() {
    const lockoutTime = localStorage.getItem(this.lockoutKey);
    if (!lockoutTime) return false;
    
    const now = Date.now();
    const lockout = parseInt(lockoutTime);
    
    if (now < lockout) {
      return true;
    } else {
      // Lockout expired, reset attempts
      localStorage.removeItem(this.lockoutKey);
      localStorage.removeItem(this.attemptKey);
      return false;
    }
  }
  
  getAttempts() {
    return parseInt(localStorage.getItem(this.attemptKey) || '0');
  }
  
  incrementAttempts() {
    const attempts = this.getAttempts() + 1;
    localStorage.setItem(this.attemptKey, attempts.toString());
    
    if (attempts >= this.maxAttempts) {
      const lockoutUntil = Date.now() + this.lockoutTime;
      localStorage.setItem(this.lockoutKey, lockoutUntil.toString());
      this.showLockoutMessage();
      return true;
    }
    
    return false;
  }
  
  setupEventListeners() {
    const form = document.getElementById('passwordForm');
    const input = document.getElementById('passwordInput');
    
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.validatePassword(input.value);
      });
      
      // Clear error on input
      input.addEventListener('input', () => {
        this.hideError();
      });
      
      // Focus input on load
      input.focus();
    }
  }
  
  validatePassword(inputPassword) {
    const trimmedInput = inputPassword.toLowerCase().trim();
    
    if (trimmedInput === this.password) {
      // Correct password
      sessionStorage.setItem(this.sessionKey, 'true');
      localStorage.removeItem(this.attemptKey); // Reset attempts on success
      this.showContent();
      
      // Analytics tracking (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'password_success', {
          'event_category': 'engagement'
        });
      }
    } else {
      // Incorrect password
      const isLockedOut = this.incrementAttempts();
      
      if (!isLockedOut) {
        this.showError();
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'password_failed', {
            'event_category': 'engagement',
            'attempts': this.getAttempts()
          });
        }
      }
    }
  }
  
  showContent() {
    const overlay = document.getElementById('passwordOverlay');
    const content = document.getElementById('protectedContent');
    
    if (overlay && content) {
      // Smooth reveal animation
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        overlay.style.display = 'none';
        content.classList.remove('hidden');
        content.classList.add('fade-in');
        
        // Update page title
        document.title = 'Altruist Leadership Case Study - Eddy Gutman | gutmandesign.co';
        
        // Scroll to top
        window.scrollTo(0, 0);
      }, 300);
    }
  }
  
  showPasswordForm() {
    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      
      // Focus input after a brief delay
      setTimeout(() => {
        const input = document.getElementById('passwordInput');
        if (input) input.focus();
      }, 100);
    }
  }
  
  showError() {
    const errorMessage = document.getElementById('errorMessage');
    const input = document.getElementById('passwordInput');
    
    if (errorMessage && input) {
      const attempts = this.getAttempts();
      const remaining = this.maxAttempts - attempts;
      
      let message = 'Incorrect password. Please try again.';
      if (remaining <= 2) {
        message += ` ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`;
      }
      
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      
      // Add error styling to input
      input.classList.add('error');
      input.select(); // Select all text for easy retry
      
      // Shake animation
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }
  
  hideError() {
    const errorMessage = document.getElementById('errorMessage');
    const input = document.getElementById('passwordInput');
    
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
    
    if (input) {
      input.classList.remove('error');
    }
  }
  
  showLockoutMessage() {
    const overlay = document.getElementById('passwordOverlay');
    const form = document.getElementById('passwordForm');
    
    if (overlay && form) {
      const lockoutTime = localStorage.getItem(this.lockoutKey);
      const remaining = Math.ceil((parseInt(lockoutTime) - Date.now()) / (60 * 1000));
      
      form.innerHTML = `
        <div class="lockout-message">
          <div class="lockout-icon">⏰</div>
          <h3>Too many attempts</h3>
          <p>Please wait ${remaining} minute${remaining === 1 ? '' : 's'} before trying again.</p>
          <p class="help-text">Don't have the password? <a href="/#contact">Contact me</a></p>
        </div>
      `;
      
      // Set up countdown timer
      this.startCountdown(parseInt(lockoutTime));
    }
  }
  
  startCountdown(lockoutUntil) {
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((lockoutUntil - now) / (60 * 1000)));
      
      if (remaining <= 0) {
        // Lockout expired, reload page
        location.reload();
        return;
      }
      
      const message = document.querySelector('.lockout-message p');
      if (message) {
        message.textContent = `Please wait ${remaining} minute${remaining === 1 ? '' : 's'} before trying again.`;
      }
    };
    
    // Update every minute
    const interval = setInterval(updateCountdown, 60000);
    updateCountdown(); // Initial update
    
    // Clean up interval when lockout expires
    setTimeout(() => {
      clearInterval(interval);
      location.reload();
    }, lockoutUntil - Date.now());
  }
  
  // Utility method for debugging (remove in production)
  reset() {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.attemptKey);
    localStorage.removeItem(this.lockoutKey);
    location.reload();
  }
}

// Initialize password protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PasswordProtection();
});

// Expose reset method for debugging (remove in production)
window.resetPassword = () => {
  sessionStorage.removeItem('portfolio_access');
  localStorage.removeItem('password_attempts');
  localStorage.removeItem('lockout_time');
  location.reload();
};