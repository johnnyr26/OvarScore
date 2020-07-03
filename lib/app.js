'use strict';
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var fs = require('fs');
var user = require('../lib/user.js');
var ago = require('../lib/ago.js');
var imodel = require('../lib/imodel.js');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: '?H$ry`lqXy%yR2folh=6m:+M}to|It',
    store: new FileStore(),
    resave: false,
    saveUninitialized: false
}));
app.get('/', function (req, res) {
    fs.readFile('views/index.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        if (!req.session.user) return res.redirect('/login');
        delete req.session.recommendation;
        return res.send(body);
    });
});
app.get('/ago', function (req, res) {
    fs.readFile('views/ago.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        //Process and display the next category
        if (!req.session.user) return res.redirect('/login');
        var nextResponse = ago.processNextResponse(req.session.responses);
        return res.send(body.replace(/{{category}}/g, nextResponse));
    });
});
app.get('/imodel', function (req, res) {
    fs.readFile('views/imodel.html', { encoding: 'utf-8' }, function (err, body) {
        if (!req.session.user) return res.redirect('/login');
        return err ? res.status(404).send('404') : res.send(body);
    });
});
app.get('/recommendation', function (req, res) {
    fs.readFile('views/recommendation.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        //Retrieves reommendation based on the ago model or the imodel
        if (!req.session.user) return res.redirect('/login');
        var recommendation = req.session.recommendation;
        if (req.session.error || recommendation === imodel.error || !recommendation) {
            if (!recommendation) {
                return res.send(body.replace('{{recommendation}}', 'Error: The recommendation got deleted.'));
            }
            var error = req.session.error || imodel.error;
            delete req.session.error;
            return res.send(body.replace('{{recommendation}}', 'Error: ' + error));
        }
        //Clears the responses
        delete req.session.responses;
        ago.clearAll();
        imodel.clearAll();
        return res.send(body.replace('{{recommendation}}', 'Recommendation: ' + recommendation));
    });
});
app.get('/login', function (req, res) {
    fs.readFile('views/login.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        if (req.session.error) {
            var error = req.session.error;
            delete req.session.error;
            return res.send(body.replace('{Error Message}', error));
        }
        delete req.session.user;
        return res.send(body.replace('{Error Message}', ''));
    });
});
app.get('/logout', function (req, res) {
    var categories = ['name', 'email', 'user', 'recommendation', 'responses', 'error'];
    categories.forEach(function (category) {
        return delete req.session[category];
    });
    return res.redirect('/');
});
app.get('/signup', function (req, res) {
    fs.readFile('views/signup.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        if (req.session.error) {
            var name = req.session.name.trim();
            var email = req.session.email.trim();
            var error = req.session.error;
            delete req.session.name;
            delete req.session.email;
            delete req.session.error;
            return res.send(body.replace('{Error Message}', error).replace('{name}', name).replace('{email}', email));
        }
        return res.send(body.replace('{Error Message}', '').replace('{name}', '').replace('{email}', ''));
    });
});
app.post('/login', function (req, res) {
    fs.readFile('views/login.html', { encoding: 'utf-8' }, function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, body) {
            var email, password;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!err) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return', err);

                        case 2:
                            email = req.body.username;
                            password = req.body.password;
                            _context.prev = 4;
                            _context.next = 7;
                            return user.logInUser(email, password);

                        case 7:
                            req.session.user = email;
                            res.redirect('/');
                            _context.next = 15;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](4);

                            req.session.error = _context.t0;
                            return _context.abrupt('return', res.redirect('/login'));

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[4, 11]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
});
app.post('/signup', function (req, res) {
    fs.readFile('views/signup.html', { encoding: 'utf-8' }, function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(err, body) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!err) {
                                _context2.next = 2;
                                break;
                            }

                            return _context2.abrupt('return', res.status(404).send('404'));

                        case 2:
                            user.signUpCredentials = req.body;
                            //If all of the entries were in the correct format and everything is confirmed
                            _context2.prev = 3;
                            _context2.next = 6;
                            return user.validateSignUpCredentials();

                        case 6:
                            user.logInUser(user.email, user.password);
                            req.session.user = user.email;
                            return _context2.abrupt('return', res.redirect('/'));

                        case 11:
                            _context2.prev = 11;
                            _context2.t0 = _context2['catch'](3);

                            req.session.name = user.name;
                            req.session.email = user.email;
                            req.session.error = _context2.t0;
                            return _context2.abrupt('return', res.redirect('/signup'));

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[3, 11]]);
        }));

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    }());
});
app.post('/ago', function (req, res) {
    fs.readFile('views/ago.html', { encoding: 'utf8' }, function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(error, body) {
            var category, response, loggedResponse, recommendation;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            //Retrieves the response to each category
                            category = req.body.category;
                            response = req.body.yes || req.body.no;
                            //Logs user response

                            _context3.prev = 2;

                            if (!req.session.responses) req.session.responses = {};
                            _context3.next = 6;
                            return ago.logResponse(category, response, req.session.responses);

                        case 6:
                            loggedResponse = _context3.sent;

                            req.session.responses = loggedResponse;
                            //If a recommendation has been made, redirect to the recommendation page
                            recommendation = ago.processNextResponse(loggedResponse);

                            if (!ago.recommendations.includes(recommendation)) {
                                _context3.next = 12;
                                break;
                            }

                            req.session.recommendation = recommendation;
                            return _context3.abrupt('return', res.redirect('/recommendation'));

                        case 12:
                            return _context3.abrupt('return', res.redirect('/ago'));

                        case 15:
                            _context3.prev = 15;
                            _context3.t0 = _context3['catch'](2);

                            console.log(_context3.t0);
                            res.session.error = _context3.t0;
                            return _context3.abrupt('return', res.redirect('/recommendation'));

                        case 20:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[2, 15]]);
        }));

        return function (_x5, _x6) {
            return _ref3.apply(this, arguments);
        };
    }());
});
app.post('/imodel', function (req, res) {
    fs.readFile('views/imodel.html', { encoding: 'utf-8' }, function (err, body) {
        if (err) return res.status(404).send('404');
        //Saves the user repsonse to an object in the imodel
        req.session.responses = {
            FIGO: req.body.FIGO,
            RD: req.body.RD,
            PFI: req.body.PFI,
            ECOG: req.body.ECOG,
            CA125: req.body.CA125,
            ASCITES: req.body.ASCITES
        };
        req.session.recommendation = imodel.calculateCumulativeScore(req.session.responses || {});
        //if all of the user recommendations were valid
        return res.redirect('/recommendation');
    });
});
var port = process.env.PORT || 8080;
app.listen(port, console.log('Listening on 8080'));