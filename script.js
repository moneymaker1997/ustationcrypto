
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
  if (!liveEl || !buyEl || !sellEl) return;

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
  const liveEl = document.getElementById(`${symbol}-price`);
  const buyEl = document.getElementById(`${symbol}-buy-price`);
  const sellEl = document.getElementById(`${symbol}-sell-price`);
  if (liveEl) liveEl.textContent = '暫不可用';
  if (buyEl) buyEl.textContent = '暫不可用';
  if (sellEl) sellEl.textContent = '暫不可用';
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
    if (updated) updated.textContent = `Last updated: ${new Date().toLocaleString()}`;
  } catch (error) {
    setPriceError('btc');
    setPriceError('eth');
    if (updated) updated.textContent = '行情接口暫時無法連接，請稍後刷新。';
    console.warn(error);
  }
}

loadPrices();
setInterval(loadPrices, 60000);
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// V9: copy customer feedback template
const copyTemplateButtons = document.querySelectorAll('[data-copy-template="feedback"]');
copyTemplateButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const template = document.getElementById('feedback-template-text')?.innerText || '';
    try {
      await navigator.clipboard.writeText(template);
      const original = button.textContent;
      button.textContent = '已複製格式';
      setTimeout(() => { button.textContent = original; }, 1800);
    } catch (error) {
      alert('複製失敗，請手動選取格式文字。');
    }
  });
});

// V12: generic copy template buttons
const genericCopyButtons = document.querySelectorAll('[data-copy-target]');
genericCopyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const targetId = button.getAttribute('data-copy-target');
    const template = document.getElementById(targetId)?.innerText || '';
    if (!template) return;
    try {
      await navigator.clipboard.writeText(template);
      const original = button.textContent;
      button.textContent = '已複製格式';
      setTimeout(() => { button.textContent = original; }, 1800);
    } catch (error) {
      alert('複製失敗，請手動選取格式文字。');
    }
  });
});
