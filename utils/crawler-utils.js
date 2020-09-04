const cheerio = require('cheerio');
const axios = require('axios').default;

utils = {};


async function clickCardIncludesText(page, text) {
    const categoryEls = await page.$$('.card-category');
    for (let i = 0; i < categoryEls.length; i++) {
        const title = JSON.stringify(await (await categoryEls[i].getProperty('innerText')).jsonValue());
        if (title.toLowerCase().includes(text.toLowerCase())) {
            categoryEls[i].click();
            await page.waitFor(4000);
            break;
        }
    }
    return page;
}

utils.getProxy = async () => {
    // API Key for proxyflow.io (Rotating Proxy)custom-control-label
    const apiKey = '002ca7a85e94c5d91146bbe5';
    const proxyURL = `https://api.proxyflow.io/v1/proxy/random?token=${apiKey}&protocol=http`
    try {
        let response = await axios.get(proxyURL);
        response = response.data;
        return { ip: response.ip, port: response.port };
    } catch (error) {
        throw error;
    }
}


utils.getCategories = async (page) => {
    await page.goto('https://www.votebolv.com/');
    await page.waitFor(4000)
    const $ = cheerio.load(await page.content());
    const categories = $('.card-title').map(function () {
        return $(this).text().trim();
    }).get();
    return categories;
}

utils.getSubCategories = async (page, category) => {
    await page.goto('https://www.votebolv.com/');
    await page.waitFor(4000)

    await clickCardIncludesText(page, category);

    const $ = cheerio.load(await page.content());
    const subCategories = $('.card-title').map(function () {
        return $(this).text().trim();
    }).get();
    return subCategories;
}


utils.getVotingOptions = async (page, category, subCategory) => {
    await page.goto('https://www.votebolv.com/');
    await page.waitFor(4000)
    await clickCardIncludesText(page, category);
    await clickCardIncludesText(page, subCategory);
    const $ = cheerio.load(await page.content());
    const options = $('.custom-control-label').map(function () {
        return $(this).text().trim();
    }).get();
    return options;
}


utils.Vote = async (page, category, subCategory, optionText) => {
    await page.goto('https://www.votebolv.com/');
    await page.waitFor(4000)
    await clickCardIncludesText(page, category);
    await page.waitFor(2000);
    await clickCardIncludesText(page, subCategory);
    await page.waitFor(2000);

    const labelsEls = await page.$$('.custom-control-label');
    for (let i = 0; i < labelsEls.length; i++) {
        const option = JSON.stringify(await (await labelsEls[i].getProperty('innerText')).jsonValue());
        if (option.toLowerCase().includes(optionText.toLowerCase())) {
            labelsEls[i].click();
            await page.waitFor(1000);
            console.log('Taking Screenshot')
            await page.screenshot({ path: './public/vote.png', fullPage: true });
            break;
        }
    }
}

module.exports = utils;