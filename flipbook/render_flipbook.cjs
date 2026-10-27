const puppeteer = require('../frontend/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function renderFlipbook() {
  console.log('🚀 Starting Binh Long Brochure Flipbook Renderer...');
  
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });

  const page = await browser.newPage();

  // Set high-DPI viewport (1240 x 1754 px is A5 @ 213 DPI, scale: 1.5 gives crisp 1860 x 2631)
  await page.setViewport({
    width: 1240,
    height: 1754,
    deviceScaleFactor: 1.5
  });

  const htmlPath = 'file://' + path.resolve(__dirname, 'brochure.html');
  console.log(`📄 Loading template: ${htmlPath}`);
  await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Capture each page individually as PNG
  const pageIds = ['trang-1', 'trang-2', 'trang-3', 'trang-4'];
  const pageFileNames = [
    'trang_1_bia.png',
    'trang_2_gioithieu.png',
    'trang_3_sohoa_qr.png',
    'trang_4_thuvibinhlong.png'
  ];

  for (let i = 0; i < pageIds.length; i++) {
    const el = await page.$(`#${pageIds[i]}`);
    if (el) {
      const outPath = path.resolve(__dirname, pageFileNames[i]);
      await el.screenshot({ path: outPath, type: 'png' });
      console.log(`✅ Saved image: ${pageFileNames[i]} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    }
  }

  // 2. Generate standard 4-page PDF (A5 portrait per page)
  const pdf4PagesPath = path.resolve(__dirname, 'binhlong_flipbook_4pages.pdf');
  await page.pdf({
    path: pdf4PagesPath,
    width: '1240px',
    height: '1754px',
    printBackground: true,
    pageRanges: '1-4',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });
  console.log(`🎉 Generated 4-page PDF: binhlong_flipbook_4pages.pdf (${(fs.statSync(pdf4PagesPath).size / 1024 / 1024).toFixed(2)} MB)`);

  await browser.close();
  console.log('🏁 Render finished successfully!');
}

renderFlipbook().catch(err => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
