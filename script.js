// ========== Header scroll ==========
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ========== Menu mobile ==========
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

mobileMenuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  const icon = mobileMenuBtn.querySelectorAll('span');
  icon[0].style.transform = icon[0].style.transform ? '' : 'rotate(45deg)';
  icon[1].style.opacity = icon[1].style.opacity ? '' : '0';
  icon[2].style.transform = icon[2].style.transform ? '' : 'rotate(-45deg)';
});

// Fecha menu ao clicar em um link
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    const icon = mobileMenuBtn.querySelectorAll('span');
    icon[0].style.transform = '';
    icon[1].style.opacity = '';
    icon[2].style.transform = '';
  });
});

// ========== Cesta de compras ========== */
let cart = [];

const cartCount = document.querySelector('.cart-count');

function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Adiciona produtos à cesta
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const title = card.querySelector('.product-title').textContent;
    const price = parseFloat(card.querySelector('.product-price').dataset.price);
    const img = card.querySelector('.product-img').textContent;

    cart.push({ title, price, img });
    updateCartCount();

    // Animação de notificação
    showNotification('Adicionado à cesta!', 'success');
  });
});

// Notificação
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

// Formulário de contato
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
