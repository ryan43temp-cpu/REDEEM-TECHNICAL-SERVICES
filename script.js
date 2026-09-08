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

  const basicStyles = document.createElement('link');
  basicStyles.rel = 'stylesheet';
  basicStyles.href = 'basic.css';
  document.head.appendChild(basicStyles);

  const plainStyles = document.createElement('link');
  plainStyles.rel = 'stylesheet';
  plainStyles.href = 'plain.css';
  document.head.appendChild(plainStyles);
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

const useLocalImage = (path, applyImage) => {
  const image = new Image();
  image.onload = () => applyImage(path);
  image.src = path;
};

useLocalImage('images/hero.jpg', (path) => {
  const image = document.querySelector('.market-hero-image img');
  if (image) image.src = path;
});
useLocalImage('images/road.jpg', (path) => {
  const image = document.querySelector('.how-image img');
  if (image) image.src = path;
});
useLocalImage('images/about.jpg', (path) => {
  const image = document.querySelector('.about-image img');
  if (image) image.src = path;
});
const localVehicleImages = { 'vehicle-one': 'images/porsche.jpg', 'vehicle-two': 'images/defender.jpg', 'vehicle-three': 'images/sprinter.jpg', 'vehicle-four': 'images/mustang.jpg' };
Object.entries(localVehicleImages).forEach(([className, path]) => {
  useLocalImage(path, (loadedPath) => {
    document.querySelectorAll(`.${className}`).forEach((element) => {
      element.style.backgroundImage = `url('${loadedPath}')`;
    });
  });
});

const vehicleIds = { 'vehicle-one': 'porsche', 'vehicle-two': 'defender', 'vehicle-three': 'sprinter', 'vehicle-four': 'mustang' };
document.querySelectorAll('.vehicle-row').forEach((row) => {
  const photo = row.querySelector('.vehicle-photo');
  const vehicleId = photo && Object.keys(vehicleIds).find((className) => photo.classList.contains(className));
  if (vehicleId) row.href = `vehicle.html?car=${vehicleIds[vehicleId]}`;
});

const vehicles = {
  porsche: { title: '2021 Porsche', model: '911 Carrera', location: 'Lusaka, Zambia', miles: '18,420', transmission: 'Automatic', status: 'Ends today · 2h 18m', price: '74500', bids: '12', image: 'vehicle-one', exterior: 'Night Blue Metallic', interior: 'Black leather', engine: '3.0L twin turbo', drive: 'Rear wheel drive' },
  defender: { title: '2022 Land Rover', model: 'Defender 110', location: 'Kitwe, Zambia', miles: '26,108', transmission: 'Automatic', status: 'Ends tomorrow · 8h 42m', price: '58200', bids: '8', image: 'vehicle-two', exterior: 'Santorini Black', interior: 'Ebony Windsor leather', engine: '3.0L turbo diesel', drive: 'Four wheel drive' },
  sprinter: { title: '2020 Mercedes-Benz', model: 'Sprinter', location: 'Ndola, Zambia', miles: '42,600', transmission: 'Automatic', status: 'Ends Fri · 1d 4h', price: '46750', bids: '5', image: 'vehicle-three', exterior: 'Arctic White', interior: 'Black cloth', engine: '3.0L V6 diesel', drive: 'Rear wheel drive' },
  mustang: { title: '2019 Ford', model: 'Mustang GT', location: 'Livingstone, Zambia', miles: '31,250', transmission: 'Manual', status: 'Ends Sat · 2d 6h', price: '32900', bids: '16', image: 'vehicle-four', exterior: 'Race Red', interior: 'Ebony leather', engine: '5.0L V8', drive: 'Rear wheel drive' }
};

const selectedVehicle = vehicles[new URLSearchParams(window.location.search).get('car')] || vehicles.porsche;
if (document.querySelector('.vehicle-detail')) {
  const detailImage = document.querySelector('.detail-image');
  const detailHeading = document.querySelector('.detail-copy h1');
  const detailLocation = document.querySelector('.detail-location');
  const detailStatus = document.querySelector('.detail-copy .vehicle-status');
  const detailPrice = document.querySelector('.detail-price strong');
  const detailBids = document.querySelector('.detail-price span');
  detailImage.className = `detail-image ${selectedVehicle.image}`;
  detailHeading.innerHTML = `${selectedVehicle.title}<br><em>${selectedVehicle.model}</em>`;
  detailLocation.textContent = `${selectedVehicle.location} · ${selectedVehicle.miles} miles · ${selectedVehicle.transmission}`;
  detailStatus.textContent = selectedVehicle.status;
  detailPrice.textContent = `$${Number(selectedVehicle.price).toLocaleString('en-US')}`;
  detailBids.textContent = `${selectedVehicle.bids} bids`;
  document.title = `${selectedVehicle.title} ${selectedVehicle.model} | Harborline`;
  const specs = document.querySelectorAll('.spec-list strong');
  [selectedVehicle.exterior, selectedVehicle.interior, selectedVehicle.engine, selectedVehicle.drive, `Clean · ${selectedVehicle.location.split(', ')[1]}`].forEach((value, index) => {
    if (specs[index]) specs[index].textContent = value;
  });
}

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