// We need file access to write our json output
var fs = require('fs');

let config = {};
try {
	config = require('./config.json');
} catch (e) {
	config = {
		username: process.env.username,
		password: process.env.password,
	};
}

const intl_login = 'https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/';
const intl_season = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/';

// Our data array ready to get populated
const data = []

class Rank {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

// SEGA hates bots and scrapers, this user agent should stop us from having issues.. at least for now...
const segaHatesBots = async (page) => {

	const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
		'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
	await page.setUserAgent(userAgent);
}

// Aight, now the good shit. Let's get our browser up.
const scraperObject = {
	url: 'intl_login',
	async scraper(browser) {

		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);

		// OK! Let's login the MaiMai website to start!
		await page.goto(intl_login);
		await page.click('span.c-button--openid--segaId');
		await page.type('#sid', config.username);
		await page.type('#password', config.password);
		await Promise.all([
			page.click('#btnSubmit'),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season}...`);

		await page.goto(intl_season);
		
		// we wait for the data we want to grab to actually load first
		await page.waitForSelector('.f_l.p_t_10.p_l_10.f_15', {
			visible: true,
		});

		console.log('Pulling season data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const tableLength = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < tableLength + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))
			
			// Write this row to our array
			const newRank = new Rank(name, sp)
			data.push(newRank)
		}
		console.log(data)

		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores.json", JSON.stringify(data), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			process.exit()

		}
		);
		
	}
}

module.exports = scraperObject;
