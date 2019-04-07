import { load } from 'cheerio';
import { connect, disconnect } from 'mongoose';
import { get } from 'request-promise';
import mongoDbUrl from './config/mongodb';
import CraigslistApt, { findOne } from './model/CraigslistApt';

const url = 'https://vermont.craigslist.org/search/apa';

async function scrapeApts() {
  const result = await get(url);
  const $ = await load(result);
  const apartments = $('.result-info')
    .map((i, element) => {
      const titleElement = $(element).find('.result-title');
      const title = titleElement.text();
      const url = titleElement.attr('href');
      const timestamp = new Date(
        $(element)
          .find('.result-date')
          .attr('datetime')
      );
      const price = $(element)
        .find('.result-price')
        .text();
      const neighborhood = $(element)
        .find('.result-hood')
        .text();
      const squareFeet = $(element).find('.housing');
      const size = squareFeet.text().trim();

      return { title, timestamp, url, price, neighborhood, size };
    })
    .get();

  return apartments;
}

async function craigslistAptToMongoDb(aptArray) {
  const promises = aptArray.map(async apartment => {
    const apartmentFromMongoDb = await findOne({
      url: apartment.url
    }).sort([['when', 1]]);
    if (!apartmentFromMongoDb) {
      const newApt = new CraigslistApt(apartment);
      return newApt.save();
    }
  });

  await Promise.all(promises);
}

async function main() {
  try {
    await connect(
      mongoDbUrl,
      { useNewUrlParser: true }
    );
    console.log('Connected to mongodb');
    const aptArray = await scrapeApts();
    await craigslistAptToMongoDb(aptArray);
    disconnect();
    console.log('disconnected from mongodb!');
  } catch (err) {
    console.error(err);
  }
}

main();
