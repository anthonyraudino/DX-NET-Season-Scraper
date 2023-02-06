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
const intl_season1 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2001';
const intl_season2 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2002';
const intl_season3 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2003';
const intl_season4 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2004';
const intl_season5 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2005';
const intl_season6 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2006';
const intl_season7 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2007';

// placeholders for future
// const intl_season8 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2008';
// const intl_season9 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2009';
// const intl_season10 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2010';
// const intl_season11 = 'https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/?season=2011';
///////

// Our data array ready to get populated
const s1rankings = []
const s2rankings = []
const s3rankings = []
const s4rankings = []
const s5rankings = []
const s6rankings = []
const s7rankings = []

// placeholders for future
// const s8rankings = []
// const s9rankings = []
// const s10rankings = []
///////


class Rank_s1 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s2 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s3 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s4 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s5 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s6 {
	constructor(name, sp) {
		this.name = name
		this.sp = sp
	}
}

class Rank_s7 {
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
		console.log(`Navigating to ${intl_season1}...`);

		await page.goto(intl_season1);
		
		// we wait for the data we want to grab to actually load first
		await page.waitForSelector('.f_l.p_t_10.p_l_10.f_15', {
			visible: true,
		});

		console.log('Pulling top 100 season 1 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))
			
			// Write this row to our array
			const newRank = new Rank_s1(name, sp)
			s1rankings.push(newRank)
		}
		console.log(s1rankings)

		console.log('Pulling top 500 season 1 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank = new Rank_s1(name, sp)
			s1rankings.push(newRank)
		}
		console.log(s1rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s1.json", JSON.stringify(s1rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season2}...`);

		await page.goto(intl_season2);

		// we wait for the data we want to grab to actually load first
	/* 	await page.waitForSelector('.ranking_top_block', {
			visible: true,
		}); */

		console.log('Pulling top 100 season 2 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s2 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s2 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s2 = new Rank_s2(name, sp)
			s2rankings.push(newRank_s2)
		}
		console.log(s2rankings)

		console.log('Pulling top 500 season 2 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s2 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s2 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s2 = new Rank_s2(name, sp)
			s2rankings.push(newRank_s2)
		}
		console.log(s2rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s2.json", JSON.stringify(s2rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season3}...`);

		await page.goto(intl_season3);

		// we wait for the data we want to grab to actually load first
		/* 	await page.waitForSelector('.ranking_top_block', {
				visible: true,
			}); */

		console.log('Pulling top 100 season 3 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s3 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s3 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s3 = new Rank_s3(name, sp)
			s3rankings.push(newRank_s3)
		}
		console.log(s3rankings)

		console.log('Pulling top 500 season 3 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s3 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s3 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s3 = new Rank_s3(name, sp)
			s3rankings.push(newRank_s3)
		}
		console.log(s3rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s3.json", JSON.stringify(s3rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season4}...`);

		await page.goto(intl_season4);

		// we wait for the data we want to grab to actually load first
		/* 	await page.waitForSelector('.ranking_top_block', {
				visible: true,
			}); */

		console.log('Pulling top 100 season 4 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s4 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s4 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s4 = new Rank_s4(name, sp)
			s4rankings.push(newRank_s4)
		}
		console.log(s4rankings)

		console.log('Pulling top 500 season 4 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s4 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s4 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s4 = new Rank_s4(name, sp)
			s4rankings.push(newRank_s4)
		}
		console.log(s4rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s4.json", JSON.stringify(s4rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season5}...`);

		await page.goto(intl_season5);

		// we wait for the data we want to grab to actually load first
		/* 	await page.waitForSelector('.ranking_top_block', {
				visible: true,
			}); */

		console.log('Pulling top 100 season 5 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s5 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s5 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s5 = new Rank_s5(name, sp)
			s5rankings.push(newRank_s5)
		}
		console.log(s5rankings)

		console.log('Pulling top 500 season 5 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s5 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s5 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s5 = new Rank_s5(name, sp)
			s5rankings.push(newRank_s5)
		}
		console.log(s5rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s5.json", JSON.stringify(s5rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season6}...`);

		await page.goto(intl_season6);

		// we wait for the data we want to grab to actually load first
		/* 	await page.waitForSelector('.ranking_top_block', {
				visible: true,
			}); */

		console.log('Pulling top 100 season 6 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s6 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s6 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s6 = new Rank_s6(name, sp)
			s6rankings.push(newRank_s6)
		}
		console.log(s6rankings)

		console.log('Pulling top 500 season 6 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s6 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s6 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s6 = new Rank_s6(name, sp)
			s6rankings.push(newRank_s6)
		}
		console.log(s6rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s6.json", JSON.stringify(s6rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			//process.exit()

		}
		);

		// Yeet, the login is done. We should be on the homepage of DX Net now, lets go to the season page.
		console.log(`Navigating to ${intl_season7}...`);

		await page.goto(intl_season7);

		// we wait for the data we want to grab to actually load first
		/* 	await page.waitForSelector('.ranking_top_block', {
				visible: true,
			}); */

		console.log('Pulling top 100 season 7 data');

		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top100Table_s7 = await page.$$eval('.ranking_top_block', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 8; i < top100Table_s7 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_top_block:nth-child(${i}) > .ranking_top_inner_block > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s7 = new Rank_s7(name, sp)
			s7rankings.push(newRank_s7)
		}
		console.log(s7rankings)

		console.log('Pulling top 500 season 7 data');


		// OK so this website is hot garbage. So we're iterating based on the block containing the player name and score
		const top500table_s7 = await page.$$eval('body > div.wrapper.main_wrapper.t_c > div', el => el.length)

		// Start iterating (NOTE: The DX Net website is hot garbage and currently the first row of the ACTUAL DATA starts from 8. LMAO)
		for (let i = 108; i < top500table_s7 + 1; i++) {
			const name = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > .f_l.p_t_10.p_l_10.f_15`))
			const sp = await page.evaluate(el => el.innerText, await page.$(`.ranking_block:nth-child(${i}) > .ranking_inner_block  > div.p_t_10.p_r_10.f_r.f_14`))

			// Write this row to our array
			const newRank_s7 = new Rank_s7(name, sp)
			s7rankings.push(newRank_s7)
		}
		console.log(s7rankings)


		//Aight lets write the array to a json file called scores.json. its sitting in the same folder as the node application
		fs.writeFile("scores_s7.json", JSON.stringify(s7rankings), function (err) {
			if (err) throw err;
			console.log('complete');
			//We done, lets GTFO
			process.exit()

		}
		);

	}
}

module.exports = scraperObject;
