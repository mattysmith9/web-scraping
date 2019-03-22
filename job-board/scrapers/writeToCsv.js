const request = require('request-promise');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const url = 'https://vermont.craigslist.org/search/sof?search_distance=200&postal=05401';

const scrapeResults = [];

async function scrapeJobHeader() {
	try {
		const htmlResult = await request.get(url);
		const $ = await cheerio.load(htmlResult);

		$('.result-info').each((index, element) => {
			const resultTitle = $(element).children('.result-title');
			const title = resultTitle.text();
			const url = resultTitle.attr('href');
			const datePosted = $(element).children('time').attr('datetime');
			const neighborhood = $(element).find('.result-hood').text();
			const scrapeResult = { title, url, datePosted, neighborhood };
			scrapeResults.push(scrapeResult);
		});
		return scrapeResults;
	} catch (err) {
		console.error(err);
	}
}

async function scrapeDescription(jobsWithHeaders) {
	return await Promise.all(
		jobsWithHeaders.map(async job => {
			try {
				const htmlResult = await request.get(job.url);
				const $ = await cheerio.load(htmlResult);
				$('.print-qrcode-container').remove();
				job.description = $('#postingbody').text();
				job.address = $('div.mapaddress').text();
				const compensationText = $('.attrgroup').children().first().text();
				job.compensation = compensationText.replace('compensation: ', '');
				return job;
			} catch (error) {
				console.error(error);
			}
		})
	);
}

/* SAVE DATA TO A CSV FILE */
async function convertToCsv(data) {
	let csv = new ObjectsToCsv(data);
	await csv.toDisk('./test.csv');
}

async function scrapeCraigslist() {
	const jobsWithHeaders = await scrapeJobHeader();
	const jobsFullData = await scrapeDescription(jobsWithHeaders);
	await convertToCsv(jobsFullData);
}

scrapeCraigslist();
