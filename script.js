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

function updateQuote(symbol, livePrice) {
  const liveEl = document.getElementById(`${symbol}-price`);
  const buyEl = document.getElementById(`${symbol}-buy-price`);
  const sellEl = document.getElementById(`${symbol}-sell-price`);

  if (typeof livePrice !== 'number') {
    liveEl.textContent = 'N/A';
    buyEl.textContent = 'N/A';
    sellEl.textContent = 'N/A';
    return;
  }

  liveEl.textContent = formatUsd(livePrice);
  buyEl.textContent = formatUsd(livePrice * 1.03);
  sellEl.textContent = formatUsd(livePrice * 0.97);
}

function setPriceError(symbol) {
  document.getElementById(`${symbol}-price`).textContent = '暫不可用';
  document.getElementById(`${symbol}-buy-price`).textContent = '暫不可用';
  document.getElementById(`${symbol}-sell-price`).textContent = '暫不可用';
}

async function loadPrices() {
  const updated = document.getElementById('updated-time');

  try {
    const endpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Price API unavailable');

    const data = await response.json();
    updateQuote('btc', data.bitcoin?.usd);
    updateQuote('eth', data.ethereum?.usd);
    updated.textContent = `Last updated: ${new Date().toLocaleString()}`;
  } catch (error) {
    setPriceError('btc');
    setPriceError('eth');
    updated.textContent = '行情接口暫時無法連接，請稍後刷新。';
    console.warn(error);
  }
}

loadPrices();
setInterval(loadPrices, 60000);

document.getElementById('year').textContent = new Date().getFullYear();
