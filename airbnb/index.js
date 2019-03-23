const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const sample = {
  guests: 1,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  costPerNight: 140
};

let browser;

async function scrapeHomesInIndexPage(url) {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    const homes = $("[itemprop='url']")
      .map((i, element) => 'https://' + $(element).attr('content'))
      .get();
    return homes;
  } catch (error) {
    console.error(error);
  }
}

async function scrapeDescriptionPage(url, page) {
  try {
    /*   
    * CONSIDER NAVIGATION FINISHED WHEN THERE ARE NO MORE
    * THAN 2 NETWORK CONNECTIONS FOR AT LEAST 500MS.
    */
    await page.goto(url, { waitUntil: 'networkidle2' });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    const pricePerNight = $(
      '#room > div > div > div > div > div > div > div > div > div > div:nth-child(1) > div > div > div > div > div > div > div > div:nth-child(1) > span > div > div > span > span'
    ).text();
    console.log(pricePerNight);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  browser = await puppeteer.launch({ headless: false });
  const descriptionPage = await browser.newPage();
  const homes = await scrapeHomesInIndexPage(
    'https://www.airbnb.ca/s/Burlington--VT--United-States/homes?refinement_paths%5B%5D=%2Fhomes&query=Burlington%2C%20VT%2C%20United%20States&place_id=ChIJ5VWbtlV6ykwRjkkOchnlX8M&allow_override%5B%5D=&s_tag=iYw3W206'
  );
  for (let i = 0; i < homes.length; i++) {
    await scrapeDescriptionPage(homes[i], descriptionPage);
  }
}

main();
