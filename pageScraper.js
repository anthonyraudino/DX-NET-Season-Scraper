const fs = require('fs');

let config = {};
try {
    config = require('./config.json');
} catch (e) {
    config = {
        username: process.env.username,
        password: process.env.password,
    };
}

const loginUrl =
    'https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/';

const scraperObject = {
    async scraper(browser) {
        const page = await browser.newPage();

// Set longer timeout for slow-loading pages
page.setDefaultNavigationTimeout(60000); // 60 seconds
page.setDefaultTimeout(60000); // 60 seconds for all waits

        // Set user agent
        const userAgent =
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
        await page.setUserAgent(userAgent);

        // Login
        console.log('Logging in...');
        await page.goto(loginUrl);
        await page.click('span.c-button--openid--segaId');
        await page.type('#sid', config.username);
        await page.type('#password', config.password);
        await Promise.all([
            page.click('#btnSubmit'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        // Navigate to the season rankings page
        console.log('Navigating to the rankings page...');
        await page.goto('https://maimaidx-eng.com/maimai-mobile/ranking/seasonRanking/');
        await page.waitForSelector('select[name="season"]', { visible: true });

        // Extract all seasons from the dropdown
        const seasons = await page.$$eval('select[name="season"] option', (options) =>
            options.map((option) => ({
                value: option.value,
                text: option.innerText,
            }))
        );

        console.log(`Found ${seasons.length} seasons. Starting data extraction...`);

        const allRankings = {};

        // Loop through each season
        for (const season of seasons) {
            if (season.value === '0') continue; // Skip "Class Ranking" or other invalid options
            console.log(`Scraping data for ${season.text} (${season.value})...`);

            // Select season and wait for page refresh
            await page.select('select[name="season"]', season.value);
            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            // Scrape rankings
            const rankings = await page.$$eval('.ranking_top_block', (blocks) =>
                blocks.map((block) => {
                    const name = block.querySelector('.f_l.p_t_10.p_l_10.f_15')?.innerText.trim();
                    const sp = block.querySelector('.p_t_10.p_r_10.f_r.f_14')?.innerText.trim();
                    return { name, sp };
                })
            );

            allRankings[season.text] = rankings;
        }

        // Save all rankings to a JSON file
        fs.writeFileSync('all_season_rankings.json', JSON.stringify(allRankings, null, 2));
        console.log('Scraping complete. Data saved to all_season_rankings.json');
    },
};

module.exports = scraperObject;
