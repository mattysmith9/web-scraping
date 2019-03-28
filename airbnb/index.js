const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

// Sample Schema
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
    /*   
    * CONSIDER NAVIGATION FINISHED WHEN THERE ARE NO MORE
    * THAN 2 NETWORK CONNECTIONS FOR AT LEAST 500MS.
    */
    await page.goto(url, { waitUntil: 'networkidle2' });
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
  let roomText;
  try {
    /*   
    * CONSIDER NAVIGATION FINISHED WHEN THERE ARE NO MORE
    * THAN 2 NETWORK CONNECTIONS FOR AT LEAST 500MS.
    */
    await page.goto(url, { waitUntil: 'networkidle2' });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    roomText = $('#room').text();


    const pricePerNight = $(
      '#room > div > div > div > div > div > div > div > div > div > div:nth-child(1) > div > div > div > div > div > div > div > div:nth-child(1) > span > div > div > span > span'
    ).text();

    // HAD TO USES REGULAR EXPRESSIONS TO EXTRACT INFORMATION.
    const guestsAllowed = returnMatches(roomText, /\d+ guest/);
    const bedrooms = returnMatches(roomText, /\d+ (studio )?bedroom/);
    const beds = returnMatches(roomText, /\d+ bed/);
    const baths = returnMatches(roomText, /\d+ (shared )?bath/);

    return {
      url,
      guestsAllowed,
      bedrooms,
      beds,
      baths,
      pricePerNight
    };
  } catch (error) {
    console.error(roomText);
    console.error(url);
    console.error(error);
  }
}

const returnMatches = (roomText, regex) => {
  const regExMatches = roomText.match(regex);
  let result = 'N/A';
  if (regExMatches != null) {
    result = regExMatches[0];
  } else {
    throw `No regex matches found for ${regex}`;
  }
  return result;
};

async function main() {
  browser = await puppeteer.launch({ headless: false });
  const descriptionPage = await browser.newPage();
  const homes = await scrapeHomesInIndexPage(
    'https://www.airbnb.ca/s/Burlington--VT--United-States/homes?refinement_paths%5B%5D=%2Fhomes&query=Burlington%2C%20VT%2C%20United%20States&place_id=ChIJ5VWbtlV6ykwRjkkOchnlX8M&allow_override%5B%5D=&s_tag=iYw3W206'
  );
  console.log(homes);
  for (let i = 0; i < homes.length; i++) {
    const result = await scrapeDescriptionPage(homes[i], descriptionPage);
    console.log(result);
  }
}

main();

/* 
    const guestMatches = roomText.match(/\d+ guest/);
    let guestsAllowed = 'N/A';
    if (guestMatches != null) {
      guestsAllowed = guestMatches[0];
    }

    const bedroomMatches = roomText.match(/\d+ bedroom/);
    let totalBedrooms = 'N/A';
    if (bedroomMatches != null) {
      totalBedrooms = bedroomMatches[0];
    }

    const bedMatches = roomText.match(/\d+ bed/);
    let totalBeds = 'N/A';
    if (bedMatches != null) {
      totalBeds = bedMatches[0];
    }

    const bathMatches = roomText.match(/\d+ bath/);
    let totalBaths = 'N/A';
    if (bathMatches != null) {
      totalBaths = bathMatches[0];
    } 
*/
