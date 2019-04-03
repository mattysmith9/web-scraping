const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request-promise');
const RedditArticle = require('./RedditArticle');

/* INITIALIZE MONGO STORE */
async function mongoConnect() {
  await mongoose.connect(
    'mongodb://redditdb:csrnQ92UrNzsyX3@ds049104.mlab.com:49104/reddit-scrape',
    { useNewUrlParser: true }
  );
  console.log('Connected to Mlab!');
}

/* BASIC IMPLEMENTATION WRANGLING JUST THE TITLES. */
async function redditScrape() {
  const html = await request.get(
    'https://www.reddit.com/r/popular/?geo_filter=US_VT'
  );
  const $ = await cheerio.load(html);
  const titles = $('h2');

  titles.each(async (i, element) => {
    try {
      const title = $(element).text();
      console.log(title);
      const redditArticle = new RedditArticle({
        title
      });
      await redditArticle.save();
    } catch (error) {
      console.error(error);
    }
  });
}

async function main() {
  await mongoConnect();
  await redditScrape();
}

main();
