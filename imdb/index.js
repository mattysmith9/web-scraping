const request = require('request-promise');
const rRequest = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

const sampleResult = {
  title: 'Captain Marvel',
  rank: 1,
  imdbRating: 7.1,
  descriptionUrl:
    'https://www.imdb.com/title/tt4154664/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=ea4e08e1-c8a3-47b5-ac3a-75026647c16e&pf_rd_r=ECM4W536JB125FKWN623&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=moviemeter&ref_=chtmvm_tt_1',
  posterUrl: 'https://www.imdb.com/title/tt4154664/mediaviewer/rm123368960',
  posterImageUrl:
    'https://m.media-amazon.com/images/M/MV5BMTE0YWFmOTMtYTU2ZS00ZTIxLWE3OTEtYTNiYzBkZjViZThiXkEyXkFqcGdeQXVyODMzMzQ4OTI@._V1_SY1000_CR0,0,675,1000_AL_.jpg'
};

async function titlesAndRatings() {
  const result = await request.get(
    'https://www.imdb.com/chart/moviemeter?ref_=nv_mv_mpm'
  );

  const $ = await cheerio.load(result);

  const movies = $('tr')
    .map((i, element) => {
      const title = $(element).find('td.titleColumn > a').text();
      const descriptionUrl =
        'https://www.imdb.com' +
        $(element).find('td.titleColumn > a').attr('href');
      const imdbRating = $(element)
        .find('td.ratingColumn.imdbRating')
        .text()
        .trim();
      return { title, imdbRating, rank: i, descriptionUrl };
    })
    .get();
  return movies;
}

async function scrapePoster(movies) {
  const moviePoster = await Promise.all(
    movies.map(async (movie) => {
      try {
        const html = await request.get(movie.descriptionUrl);
        const $ = await cheerio.load(html);
        movie.posterUrl =
          'https://www.imdb.com' + $('div.poster > a').attr('href');
        return movie;
      } catch (error) {
        //console.error(error);
      }
    })
  );
  return moviePoster;
}

async function scrapePosterImage(movies) {
  for (let i = 0; i < movies.length; i++) {
    try {
      const posterImageUrl = await nightmare
        .goto(movies[i].posterUrl)
        .evaluate(() =>
          $(
            '#photo-container > div > div:nth-child(2) > div > div.pswp__scroll-wrap > div.pswp__container > div:nth-child(2) > div > img:nth-child(2)'
          ).attr('src')
        );
      movies[i].posterImageUrl = posterImageUrl;

      saveImageToDisk(movies[i]);

      console.log(movies[i]);
    } catch (error) {
      console.error(error);
    }
  }
  return movies;
}

async function saveImageToDisk(movie) {
  rRequest
    .get(movie.posterImageUrl)
    .pipe(fs.createWriteStream('posters/${movie.rank}.png'));
}

async function main() {
  let movies = await titlesAndRatings();
  movies = await scrapePoster(movies);
  movies = await scrapePosterImage(movies);
}

main();
