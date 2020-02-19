const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const fs = require("fs");
const {promisify}  = require('util')

const indexRouter = require('./routes/index');
const testAPIRouter = require("./routes/testAPI");
const approutes = require('./routes/approutes');
const repaymentClass = require("./services/repayment");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter);
//app.use('/approutes', approutes);


const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
//Read Inputs
console.log('Reading Data...');
let rawData = fs.readFileSync('./config/appData.json');
let totalData = JSON.parse(rawData);
let seasonsData = totalData.Seasons;
let customersData = totalData.Customers;
let summariesData = totalData.CustomerSummaries;
let uploadsData = totalData.RepaymentUploads;


//Get changes with algorithm
const repayment = new repaymentClass(uploadsData,summariesData);
let repaymentsOutput = repayment.updateSummaries();
let flatennedOutput = repaymentsOutput.reduce(function(a,b){ return a.concat(b) }, []);
//Store Output Data
let dataOutput = JSON.stringify(flatennedOutput);
fs.writeFile('./config/outPutRepayment.json', dataOutput, encoding = 'utf8', (err) => {
  if (err) {
      throw err;
  }

  console.log('writting...');
});
//Make Changes


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



module.exports = app;
