const puppeteer = require('../frontend/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function renderAll() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  const tasks = [
    {
      html: 'documents/poster_intro/poster_standee_vertical.html',
      output: 'documents/poster_intro/poster_standee_vertical.png',
      width: 1200,
      height: 1920,
      transparent: false
    },
    {
      html: 'documents/poster_intro/poster_standee_transparent.html',
      output: 'documents/poster_intro/poster_standee_transparent.png',
      width: 1200,
      height: 1920,
      transparent: true
    },
    {
      html: 'documents/poster_intro/poster_intro_app.html',
      output: 'documents/poster_intro/poster_intro_binhlong_vr.png',
      width: 1920,
      height: 1080,
      transparent: false
    }
  ];

  for (const t of tasks) {
    const fileUrl = 'file://' + path.resolve(t.html);
    await page.setViewport({ width: t.width, height: t.height, deviceScaleFactor: 1 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.resolve(t.output),
      omitBackground: t.transparent,
      type: 'png'
    });
    console.log(`Rendered: ${t.output} (${fs.statSync(t.output).size} bytes)`);
  }

  await browser.close();
  console.log('All posters rendered successfully with Puppeteer!');
}

renderAll().catch(err => {
  console.error(err);
  process.exit(1);
});
