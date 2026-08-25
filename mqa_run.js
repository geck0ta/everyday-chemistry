const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');

(async () => {
  let browser;
  try {
    // gunakan Chrome / Edge yang terpasang di Windows
    const b = await puppeteer.launch({
      product: 'chrome',
      headless: 'new',
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=375,812'],
      defaultViewport: { width: 375, height: 812 },
    });
    global.__browser = b;
    browser = b;
  } catch (e) {
    // fallback: cari chrome di jalur baku Windows
    const paths = [
      process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
      process.env.PROGRAMFILES + '/Google/Chrome/Application/chrome.exe',
      process.env.PROGRAMFILES + '/Google/Chrome/Application/chrome.exe',
    ];
    for (const p of paths) {
      try {
        browser = await puppeteer.launch({
          executablePath: p,
          headless: 'new',
          args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=375,812'],
          defaultViewport: { width: 375, height: 812 },
        });
        global.__browser = browser;
        break;
      } catch (e2) { /* try next */ }
    }
  }
  if (!browser) { console.log("ERR no chrome"); process.exit(1); }

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36");

  for (const path of ["/tabel-periodik", "/simulasi", "/kenali-zat", "/"]) {
    try {
      await page.goto("http://localhost:3005" + path, { waitUntil: "networkidle0", timeout: 25000 });
    } catch (e) { console.log(`${path}: NAV FAIL ${e.message.slice(0,60)}`); continue; }
    const data = await page.evaluate(() => {
      const offenders = [];
      document.querySelectorAll("*").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 390 && (r.left < 390)) {
          offenders.push({ tag: el.tagName, cls: (el.className || "").slice(0, 50), w: Math.round(r.width) });
        }
      });
      return {
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        offenders: offenders.slice(0, 4),
      };
    });
    let flag = "";
    if (data.scrollW > data.clientW + 8) flag += " H-OVERFLOW";
    if (data.offenders.length) flag += " WIDE-ELEMENTS";
    console.log(`${path}: W=${data.clientW} scroll=${data.scrollW} offenders=${data.offenders.length}${flag}`);
    if (data.offenders.length) console.log("  top:", JSON.stringify(data.offenders[0]));
  }
  await browser.close();
})().catch(e => { console.log("ERR", e.message); process.exit(1); });
