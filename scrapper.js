const puppeteer = require("puppeteer");

const getAppData = async (url) => {
  // Set up a headless browser to begin scrapping
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  const page = await browser.newPage();

  const imageRequests = [];

  page.on('response', async (response) => {
    const request = response.request();
    const url = request.url();
    const resourceType = request.resourceType();

    // Optional: log or filter
    if (resourceType === 'image') {
      // imageRequests.push(url);
      if (url.includes('/image/thumb/') || url.includes('mzstatic.com')) {
          imageRequests.push(url);
        }
    }
  });

  // Navigate to the provided url, but before scrapping we need to wait for the content to be loaded
  // we use "networkidle2" because we need to wait for the images to be loaded
  await page.goto(url,{ waitUntil: 'networkidle2' });

  const priceData = await page.evaluate(() => {
    // This is the class the Apple App Store uses for the price element
    const productHeaderArray = document.querySelectorAll(".product-header__list__item");
    let price = '';
    // The page may contain several nodes with the same class, iterate over them to find the price related one
    productHeaderArray.forEach((headerItem) => {
      const innerText = headerItem.innerText;
      // Regex to find the price in mexican currency ($x,xxx.xx)
      const matchingValues = innerText.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/);

      if (matchingValues && matchingValues.length > 0) {
        price = matchingValues[0]
      };
    });
    return price;
  });

  const title = await page.evaluate(() => {
    const el = document.querySelector('h1.product-header__title.app-header__title');
    if (!el) return null;

    return el.innerText.trim();
  });

  const subtitle = await page.evaluate(() => {
    const el = document.querySelector('h2.product-header__subtitle.app-header__subtitle');
    return el ? el.innerText.trim() : 'Not found or empty';
  });

  const data = {
    title: title,
    price: priceData,
    image: imageRequests[0],
    description: subtitle
  }

  await browser.close();

  return data;
}

const myFunc = () => {
  return 'test';
}

module.exports = {
  getAppData: getAppData,
  getData: myFunc
}

// const minecraft = "https://apps.apple.com/mx/app/minecraft-explora-con-amigos/id479516143";
// const balatro = "https://apps.apple.com/mx/app/balatro/id6502453075";
// // Most expensive
// const priciest = "https://apps.apple.com/mx/app/cybertuner/id490451741";