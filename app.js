const express = require('express');
const app = express();
const helmet = require('helmet');

const index = require('./routes/index');
const ago = require('./routes/ago');
const imodel = require('./routes/imodel');
const fagotti = require('./routes/fagotti');
const errorPage = require('./routes/404');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/ago', ago);
app.use('/imodel', imodel);
app.use('/fagotti', fagotti);
app.use('/*', errorPage);

const port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on 8080'));