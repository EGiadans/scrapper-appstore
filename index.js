import puppeteer from "puppeteer";

const getPrice = async (url) => {
  // Set up a headless browser to begin scrapping
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  const page = await browser.newPage();

  // Navigate to the provided url, but before scrapping we need to wait for the content to be loaded
  await page.goto(url,{ waitUntil: 'domcontentloaded' });

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

  console.log('priceData: ', priceData);

  await browser.close();
}

const minecraft = "https://apps.apple.com/mx/app/minecraft-explora-con-amigos/id479516143";
const balatro = "https://apps.apple.com/mx/app/balatro/id6502453075";
// Most expensive
const priciest = "https://apps.apple.com/mx/app/cybertuner/id490451741";

getPrice(minecraft);