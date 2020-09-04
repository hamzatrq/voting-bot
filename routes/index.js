const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const Scraper = require('../utils/crawler-utils.js');
const fs = require('fs');

router.get('/add', function (req, res, next) {
  res.render('index', { title: 'Voter App' });
});

router.get('/', function (req, res, next) {
  try {
    const rawdata = fs.readFileSync('data.json');
    const bot = JSON.parse(rawdata);
    res.render('details', { title: 'Voter App', bot });
  } catch (error) {
    res.render('details', { title: 'Voter App', bot: { category: "No Bot Added", subcategory: "No Bot Added", option: "No Bot Added" } });
  }
});

router.get('/categories', async function (req, res, next) {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const proxy = await utils.getProxy();
  const page = await context.newPage({ args: [`--proxy-server=${proxy.ip}:${proxy.port}`] });

  try {
    const categories = await Scraper.getCategories(page);
    res.json(categories);
    page.close();
    context.close();
    browser.close();
  } catch (error) {
    res.status(500).json(error);
    page.close();
    context.close();
    browser.close();
  }
});

router.post('/subcategories', async function (req, res, next) {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const proxy = await utils.getProxy();
  const page = await context.newPage({ args: [`--proxy-server=${proxy.ip}:${proxy.port}`] });

  const { category } = req.body;

  try {
    const subcategories = await Scraper.getSubCategories(page, category);
    res.json(subcategories);
    page.close();
    context.close();
    browser.close();
  } catch (error) {
    res.status(500).json(error);
    page.close();
    context.close();
    browser.close();
  }
});

router.post('/voting-options', async function (req, res, next) {
  const browser = await puppeteer.launch();
  const context = await browser.createIncognitoBrowserContext();
  const proxy = await utils.getProxy();
  const page = await context.newPage({ args: [`--proxy-server=${proxy.ip}:${proxy.port}`] });

  const { category, subcategory } = req.body;
  console.log(category, subcategory)
  try {
    const subcategories = await Scraper.getVotingOptions(page, category, subcategory);
    res.json(subcategories);
    page.close();
    context.close();
    browser.close();
  } catch (error) {
    res.status(500).json(error);
    page.close();
    context.close();
    browser.close();
  }
});


router.post('/add-bot', async function (req, res, next) {
  const { category, subcategory, option } = req.body;
  console.log(category, subcategory, option)

  if (!category || !subcategory || !option) {
    return res.json({ message: 'Something went wrong. Please try again' });
  }


  const data = JSON.stringify({
    category,
    subcategory,
    option
  });
  fs.writeFileSync('data.json', data);
  res.redirect('/')
});

module.exports = router;
