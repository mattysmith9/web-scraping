const request = require('request-promise');

async function scrape() {
	const url = 'https://mattermark.com/';
	const json = await request.get(url);
}

scrape();
