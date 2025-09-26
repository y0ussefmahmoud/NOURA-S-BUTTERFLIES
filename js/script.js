// =========================
// Noura's Butterflies - Main JavaScript
// =========================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('.header');
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const cartCountEl = document.querySelector('.cart-count');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  const quickViewButtons = document.querySelectorAll('.quick-view-btn');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  // -------------------------
  // Local Storage - Cart State
  // -------------------------
  const STORAGE_KEY = 'nb_cart';

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { items: {}, totalCount: 0 };
    } catch (e) {
      console.warn('Failed to parse cart from storage', e);
      return { items: {}, totalCount: 0 };
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function updateCartCountUI(count) {
    if (cartCountEl) {
      cartCountEl.textContent = count;
      // Add animation effect
      cartCountEl.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartCountEl.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // Initialize cart
  let cart = loadCart();
  updateCartCountUI(cart.totalCount);

  // -------------------------
  // Header shadow on scroll
  // -------------------------
  function onScrollHeader() {
    if (window.scrollY > 10) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  
  // Initial check
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader);

  // -------------------------
  // Mobile menu toggle
  // -------------------------
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isActive));
      
      // Animate hamburger bars
      const bars = hamburger.querySelectorAll('.bar');
      if (isActive) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger animation
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }

  // -------------------------
  // Smooth scroll for internal links
  // -------------------------
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const yOffset = -70; // height compensation for fixed header
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({ 
            top: y, 
            behavior: 'smooth' 
          });

          // Close mobile menu after navigation
          if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger animation
            const bars = hamburger?.querySelectorAll('.bar');
            if (bars) {
              bars[0].style.transform = 'none';
              bars[1].style.opacity = '1';
              bars[2].style.transform = 'none';
            }
          }

          // Update active link
          document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // -------------------------
  // Add to Cart functionality
  // -------------------------
  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const id = btn.getAttribute('data-product') || 'unknown';
      const card = btn.closest('.product-card');
      const nameEl = card?.querySelector('.product-name');
      const priceEl = card?.querySelector('.product-price');
      
      const name = nameEl ? nameEl.textContent?.trim() : id;
      const priceText = priceEl ? priceEl.textContent?.replace(/[^\d.]/g, '') : '0';
      const price = parseFloat(priceText) || 0;

      // Update cart state
      if (!cart.items[id]) {
        cart.items[id] = { name, price, qty: 0 };
      }
      cart.items[id].qty += 1;
      cart.totalCount += 1;

      // Save to localStorage
      saveCart(cart);
      updateCartCountUI(cart.totalCount);

      // Visual feedback
      btn.classList.add('added');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
      btn.disabled = true;

      // Reset button after delay
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 1500);

      // Show success message
      showNotification(`تم إضافة ${name} إلى السلة`, 'success');
    });
  });

  // -------------------------
  // Quick View functionality
  // -------------------------
  quickViewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const card = btn.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent?.trim() || 'المنتج';
      const price = card?.querySelector('.product-price')?.textContent?.trim() || '';
      const img = card?.querySelector('.product-image img');
      const imgSrc = img?.src || '';

      // Create modal for quick view
      showQuickViewModal(name, price, imgSrc);
    });
  });

  // -------------------------
  // Notification System
  // -------------------------
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#2ecc71' : '#3498db'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // -------------------------
  // Quick View Modal
  // -------------------------
  function showQuickViewModal(name, price, imgSrc) {
    // Remove existing modal
    const existing = document.querySelector('.quick-view-modal');
    if (existing) {
      existing.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-body">
            <div class="modal-image">
              <img src="${imgSrc}" alt="${name}">
            </div>
            <div class="modal-info">
              <h3>${name}</h3>
              <p class="modal-price">${price}</p>
              <p class="modal-description">
                منتج رائع من مجموعة فراشات نورا المميزة. مصنوع بعناية فائقة من أجود الخامات لإطلالة أنيقة ومتميزة.
              </p>
              <button class="btn btn-primary modal-add-to-cart">
                <i class="fas fa-shopping-cart"></i>
                أضيفي للسلة
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Add modal styles to head
    if (!document.querySelector('#modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'modal-styles';
      styles.textContent = `
        .modal-overlay {
          background: rgba(0,0,0,0.8);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          position: relative;
          animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #999;
          z-index: 1;
        }
        .modal-close:hover {
          color: #333;
        }
        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
        }
        .modal-image img {
          width: 100%;
          border-radius: 15px;
        }
        .modal-info h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #2d3436;
        }
        .modal-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ff6b9d;
          margin-bottom: 1rem;
        }
        .modal-description {
          color: #636e72;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .modal-add-to-cart {
          width: 100%;
        }
        @media (max-width: 768px) {
          .modal-body {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(modal);

    // Close modal events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        modal.remove();
      }
    });

    // Escape key to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  // -------------------------
  // Scroll animations (Intersection Observer)
  // -------------------------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.product-card, .feature, .section-header');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // -------------------------
  // Cart functionality (simple version)
  // -------------------------
  function showCartSummary() {
    if (cart.totalCount === 0) {
      showNotification('السلة فارغة', 'info');
      return;
    }

    let cartHTML = '<div style="max-height: 300px; overflow-y: auto;">';
    Object.entries(cart.items).forEach(([id, item]) => {
      cartHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.price} ج.م × ${item.qty}</small>
          </div>
          <div>${(item.price * item.qty).toFixed(0)} ج.م</div>
        </div>
      `;
    });
    cartHTML += '</div>';

    const total = Object.values(cart.items).reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartHTML += `<div style="margin-top: 1rem; font-weight: bold; text-align: center;">المجموع: ${total.toFixed(0)} ج.م</div>`;

    // Show in a simple alert for now (can be enhanced with a proper modal)
    const cartModal = document.createElement('div');
    cartModal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 400px; width: 90%;">
          <h3 style="margin-bottom: 1rem; text-align: center;">سلة التسوق</h3>
          ${cartHTML}
          <div style="margin-top: 1rem; text-align: center;">
            <button onclick="this.closest('div').parentElement.remove()" style="background: #ff6b9d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">إغلاق</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(cartModal);
  }

  // Add click event to cart link
  const cartLink = document.querySelector('.cart-link');
  if (cartLink) {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      showCartSummary();
    });
  }

  // -------------------------
  // Expose API for debugging
  // -------------------------
  window.NB = {
    getCart: () => ({ ...cart }),
    clearCart: () => {
      cart = { items: {}, totalCount: 0 };
      saveCart(cart);
      updateCartCountUI(0);
      showNotification('تم مسح السلة', 'info');
    },
    showNotification,
    cart
  };

  // -------------------------
  // Newsletter Subscription
  // -------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('subscriberName');
      const emailInput = document.getElementById('subscriberEmail');
      const submitBtn = newsletterForm.querySelector('.subscribe-btn');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      
      if (!name || !email) {
        showNotification('يرجى ملء جميع الحقول', 'info');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'info');
        return;
      }
      
      // Simulate subscription process
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاشتراك...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Save to localStorage (in real app, send to server)
        const subscribers = JSON.parse(localStorage.getItem('nb_subscribers') || '[]');
        const newSubscriber = {
          name,
          email,
          date: new Date().toISOString(),
          id: Date.now()
        };
        subscribers.push(newSubscriber);
        localStorage.setItem('nb_subscribers', JSON.stringify(subscribers));
        
        // Reset form
        nameInput.value = '';
        emailInput.value = '';
        
        // Success feedback
        submitBtn.innerHTML = '<i class="fas fa-check"></i> تم الاشتراك بنجاح!';
        submitBtn.style.background = '#2ecc71';
        
        showNotification(`مرحباً ${name}! تم اشتراكك بنجاح في نشرتنا الإخبارية`, 'success');
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
        
      }, 2000);
    });
  }

  // -------------------------
  // Countdown Timer for Offers
  // -------------------------
  function updateCountdown() {
    const now = new Date().getTime();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15); // 15 days from now
    endDate.setHours(23, 59, 59, 999); // End of day
    
    const distance = endDate.getTime() - now;
    
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      
      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    }
  }
  
  // Update countdown every minute
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // -------------------------
  // Initialize
  // -------------------------
  console.log('🦋 Noura\'s Butterflies website loaded successfully!');
  console.log('Cart items:', cart.totalCount);
  
  // Expose newsletter API for debugging
  window.NB.getSubscribers = () => {
    return JSON.parse(localStorage.getItem('nb_subscribers') || '[]');
  };
});
