const request = require('request-promise');
const rRequest = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

/* FINISH SCRAPE LATER */
async function vermontBusinessList() {
  const result = await request.get(
    'https://www.crunchbase.com/search/organization.companies/e99aa9c94aaed0d98a60c3bc7f3fd1daed2e8824'
  );
  const $ = await cheerio.load(result);
  const businessList = $('.component--grid-body')
    .map((i, element) => {
      const businessName = $(element).find('.component--grid-row').text();
      return { businessList, businessName };
    })
    .get();
}

async function main() {
  let result = await vermontBusinessList();
}

main();
