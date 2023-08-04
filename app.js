const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const web = require('./routes/web');
const cron = require('node-cron');
var session = require('express-session');
const nodemailer = require("nodemailer");
const moment = require('moment');
require('./db/connectiondb');

const cookieParser = require('cookie-parser')
var cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(cookieParser())
// Middleware
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'secret',
  // cookie:{maxAge : 60000},
  resave:false,
  saveUninitialized:false,
}))

cron.schedule("* * * * *", async () => {
  console.log("Cron job started for salary calculation...");
  SalaryController.calculateSalaries();
  console.log("Cron job completed.");
});
// router load
app.use('/',web)

// ejs template
app.set('view engine', 'ejs')


// public folder setup
app.use("/public", express.static(__dirname + "/public/"));
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
