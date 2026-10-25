// ========== Loading Screen ==========
const loadingScreen = document.querySelector('.loading-screen');

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 800);
});

// ========== Header Scroll ==========
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ========== Mobile Menu ==========
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

mobileMenuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  const icon = mobileMenuBtn.querySelectorAll('span');
  icon[0].style.transform = icon[0].style.transform ? '' : 'rotate(45deg)';
  icon[1].style.opacity = icon[1].style.opacity ? '' : '0';
  icon[2].style.transform = icon[2].style.transform ? '' : 'rotate(-45deg)';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    const icon = mobileMenuBtn.querySelectorAll('span');
    icon[0].style.transform = '';
    icon[1].style.opacity = '';
    icon[2].style.transform = '';
  });
});

// ========== Cart Counter ==========
let cartCount = 0;
const cartCountEl = document.querySelector('.cart-count');

document.querySelectorAll('.btn-add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    cartCount++;
    cartCountEl.textContent = cartCount;

    // Throb effect
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);

    // Notification
    showNotification('Adicionado à cesta!', 'success');
  });
});

// ========== Notification ==========
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 14px 24px;
    border-radius: 12px;
    color: var(--branco);
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.4s ease-out;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  `;

  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  } else {
    notification.style.background = 'linear-gradient(135deg, var(--rosa-forte), var(--vermelho))';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.4s';
    setTimeout(() => notification.remove(), 400);
  }, 2000);
}

// ========== Animations on Scroll ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

document.querySelectorAll('.product-card').forEach((card, index) => {
  card.style.animation = 'none';
  card.style.animationDelay = `${index * 0.15}s`;
  observer.observe(card);
});

// ========== Contact Form ==========
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.opacity = '1';
    e.target.reset();
    showNotification('Mensagem enviada com sucesso! 🎉', 'success');
  }, 1000);
});

// ========== Smooth Scroll for Anchor Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== Product Card Animation on Hover ==========
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// ========== Hero Animation Checker ==========
// Animate hero elements when within viewport
const heroElements = document.querySelectorAll('.hero-content > *');

// Add stagger animation to hero elements
const heroStagger = (elements, delay) => {
  elements.forEach((el, i) => {
    el.style.animationDelay = `${delay * (i + 1)}s`;
  });
};

const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroActions = document.querySelector('.hero-actions');
const heroStats = document.querySelector('.hero-stats');

heroStagger([heroTitle, heroSubtitle, heroActions, heroStats], 0.2);
