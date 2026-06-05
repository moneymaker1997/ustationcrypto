# U Station Crypto Website

这是一个适合 GitHub Pages / Vercel / Netlify 部署的静态网站。

## 文件说明

- index.html：网站主页面
- style.css：网站样式
- script.js：菜单与 BTC/ETH/USDT 实时行情
- images/qr-placeholder.svg：二维码占位图

## 替换二维码

把你的二维码图片放进 images 文件夹，并命名为：

- wechat-qr.png
- whatsapp-qr.png
- telegram-qr.png

如果不替换，网站会自动显示占位二维码。

## 修改邮箱

打开 index.html，搜索：

business@ustationcrypto.com

把它改成你的真实商务邮箱。

## 实时行情

行情使用 CoinGecko 免费公开接口：
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd

如果访问频繁，免费接口可能会限流。正式商用建议换成带 API Key 的行情服务。
