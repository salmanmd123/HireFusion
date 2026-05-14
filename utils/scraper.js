const puppeteer = require('puppeteer');

async function scrapeLinkedInJobs(keyword, location, datePosted) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&f_TPR=${datePosted}`;
    
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        return await page.evaluate(() => {
            const nodes = document.querySelectorAll('.jobs-search__results-list li');
            return Array.from(nodes).map(node => ({
                title: node.querySelector('.base-search-card__title')?.innerText.trim(),
                company: node.querySelector('.base-search-card__subtitle')?.innerText.trim(),
                link: node.querySelector('.base-card__full-link')?.href
            })).slice(0, 5); 
        });
    } catch (error) {
        return [];
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeLinkedInJobs };