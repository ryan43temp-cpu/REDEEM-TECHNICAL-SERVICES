const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (document.body.classList.contains('marketplace-page')) {
  const marketplaceStyles = document.createElement('link');
  marketplaceStyles.rel = 'stylesheet';
  marketplaceStyles.href = 'marketplace.css';
  document.head.appendChild(marketplaceStyles);

  const currencyStyles = document.createElement('link');
  currencyStyles.rel = 'stylesheet';
  currencyStyles.href = 'currency.css';
  document.head.appendChild(currencyStyles);
}

const locationUpdates = {
  'Atlanta, GA': 'Lusaka, Zambia',
  'Atlanta, Georgia': 'Lusaka, Zambia',
  'Austin, TX': 'Kitwe, Zambia',
  'Denver, CO': 'Ndola, Zambia',
  'Nashville, TN': 'Livingstone, Zambia',
  'Georgia': 'Zambia',
  'Atlanta': 'Lusaka',
  '101 Peachtree Street': 'Plot 101 Cairo Road',
  '30303': '10101',
  'ET': 'CAT'
};

const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
textNodes.forEach((node) => {
  Object.entries(locationUpdates).forEach(([from, to]) => {
    node.nodeValue = node.nodeValue.replaceAll(from, to);
  });
});

const currencyToggle = document.createElement('button');
currencyToggle.className = 'currency-toggle';
currencyToggle.type = 'button';
currencyToggle.setAttribute('aria-label', 'Switch currency');
currencyToggle.textContent = 'Switch to Kwacha';
mainNav.appendChild(currencyToggle);

const priceElements = document.querySelectorAll('.vehicle-price strong, .detail-price strong');
priceElements.forEach((element) => {
  element.dataset.usd = element.textContent.replace(/[^0-9.]/g, '');
});
const staticCurrencyNodes = textNodes
  .filter((node) => node.nodeValue.includes('$250'))
  .map((node) => ({ node, original: node.nodeValue }));

let activeCurrency = localStorage.getItem('harborlineCurrency') || 'USD';
const updateCurrency = () => {
  priceElements.forEach((element) => {
    const usd = Number(element.dataset.usd);
    if (activeCurrency === 'USD') {
      element.textContent = `$${usd.toLocaleString('en-US')}`;
    } else {
      element.textContent = `K${Math.round(usd * 19.79).toLocaleString('en-US')}`;
    }
  });
  staticCurrencyNodes.forEach(({ node, original }) => {
    node.nodeValue = original.replace('$250', activeCurrency === 'USD' ? '$250' : 'K4,948');
  });
  currencyToggle.textContent = activeCurrency === 'USD' ? 'Switch to Kwacha' : 'Switch to USD';
  document.documentElement.dataset.currency = activeCurrency;
};
currencyToggle.addEventListener('click', () => {
  activeCurrency = activeCurrency === 'USD' ? 'ZMW' : 'USD';
  localStorage.setItem('harborlineCurrency', activeCurrency);
  updateCurrency();
});
updateCurrency();

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const success = form.querySelector('.form-success');
    form.reset();
    success.classList.add('show');
  });
}