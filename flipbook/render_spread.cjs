const puppeteer = require('../frontend/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function renderSpread() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 2480, height: 1754, deviceScaleFactor: 1 });

  const htmlPath = 'file://' + path.resolve(__dirname, 'brochure_spread.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // 1. Capture Sheet 1 & Sheet 2
  const s1 = await page.$('#sheet-1');
  if (s1) {
    await s1.screenshot({ path: path.resolve(__dirname, 'sheet_1_mat_ngoai.png'), type: 'png' });
    console.log('✅ Rendered sheet_1_mat_ngoai.png');
  }

  const s2 = await page.$('#sheet-2');
  if (s2) {
    await s2.screenshot({ path: path.resolve(__dirname, 'sheet_2_mat_trong.png'), type: 'png' });
    console.log('✅ Rendered sheet_2_mat_trong.png');
  }

  // 2. Generate 2-sheet spread PDF
  const pdfPath = path.resolve(__dirname, 'binhlong_flipbook_spread_print.pdf');
  await page.pdf({
    path: pdfPath,
    width: '2480px',
    height: '1754px',
    printBackground: true,
    pageRanges: '1-2',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });
  console.log('🎉 Rendered spread PDF: binhlong_flipbook_spread_print.pdf');

  await browser.close();
}

renderSpread().catch(err => {
  console.error(err);
  process.exit(1);
});
