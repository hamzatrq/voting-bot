var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

const puppeteer = require('puppeteer');
const Scraper = require('./utils/crawler-utils');
const fs = require('fs');

var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * *', async function () {
  try {
    console.log('Voting...')
    const rawdata = fs.readFileSync('data.json');
    const bot = JSON.parse(rawdata);
    const { category, subcategory, option } = bot;

    if (category, subcategory, option) {
      const browser = await puppeteer.launch();
      const context = await browser.createIncognitoBrowserContext();
      const proxy = await utils.getProxy();
      const page = await context.newPage({ args: [`--proxy-server=${proxy.ip}:${proxy.port}`] });


      await Scraper.Vote(page, category, subcategory, option);

      await page.close();
      await context.close();
      await browser.close();
      console.log('Voting finished successfully')
    }
  } catch (error) {
    console.log('Voting failed')
    console.log(error);
  }

}, null, true, 'America/Los_Angeles');
job.start();

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
  challenge: true,
  users: { 'admin': 'votingbot1' }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
