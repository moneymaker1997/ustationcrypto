const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const formatUsd = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 10 ? 0 : 4,
  }).format(value);
};

async function loadPrices() {
  const btc = document.getElementById('btc-price');
  const eth = document.getElementById('eth-price');
  const usdt = document.getElementById('usdt-price');
  const updated = document.getElementById('updated-time');

  try {
    const endpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd';
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Price API unavailable');

    const data = await response.json();
    btc.textContent = formatUsd(data.bitcoin?.usd);
    eth.textContent = formatUsd(data.ethereum?.usd);
    usdt.textContent = formatUsd(data.tether?.usd);
    updated.textContent = `Last updated: ${new Date().toLocaleString()}`;
  } catch (error) {
    btc.textContent = '暫不可用';
    eth.textContent = '暫不可用';
    usdt.textContent = '暫不可用';
    updated.textContent = '行情接口暫時無法連接，請稍後刷新。';
    console.warn(error);
  }
}

loadPrices();
setInterval(loadPrices, 60000);

document.getElementById('year').textContent = new Date().getFullYear();
