import config from './config';
import express from 'express';
import partials from 'express-partials';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import authManager from './lib/authentication';
import socketAuthenticator from './lib/socket-auth';
import refresh from './lib/refresh';
import pullManager from './lib/pull-manager';
import dbManager from './lib/db-manager';
import pullQueue from './lib/pull-queue';
import mainController from './controllers/main';
import hooksController from './controllers/githubHooks';
import reqLoggerFactory from './lib/debug';
const reqLogger = reqLoggerFactory('pulldasher:server:request');
import debugFactory from './lib/debug';
const debug = debugFactory('pulldasher');
var passport = authManager.passport;

var app = express();
var httpServer = require('http').createServer(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/**
 * Middleware
 */
app.use("/public", express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/dist'));
app.use("/spec", express.static(__dirname + '/views/current/spec'));
app.use("/css", express.static(__dirname + '/views/current/css'));
app.use("/html", express.static(__dirname + '/views/current/html'));
app.use("/fonts", express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use(partials());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({
   secret: config.session.secret,
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
   reqLogger("%s %s", req.method, req.url);
   next();
});


/**
 * Routes
 */
authManager.setupRoutes(app);
app.get('/',            mainController.index);
app.post('/hooks/main', hooksController.main);

config.repos.forEach(function(repo) {
   // Load open pulls from the DB so we don't start blank.
   dbManager.getOpenPulls(repo).then(function(pulls) {
      pullQueue.pause();
      pulls.forEach(function(pull) {
         pullManager.updatePull(pull);
      });
      pullQueue.resume();
   }).done();
});

/*
@TODO: Update pulls which were open last time Pulldasher ran but are closed now.
dbManager.closeStalePulls();
*/


//====================================================
// Socket.IO
var io = require('socket.io').listen(httpServer);
io.sockets.on('connection', function (socket) {
   var unauthenticated_timeout = config.unauthenticated_timeout !== undefined ?
      config.unauthenticated_timeout : 10 * 1000;

   var autoDisconnect = setTimeout(function() {
      socket.disconnect();
   }, unauthenticated_timeout);

   socket.on('authenticate', function(token) {
      // They did respond. No need to drop their connection for not responding.
      clearTimeout(autoDisconnect);

      var user = socketAuthenticator.retrieveUser(token);
      if (user) {
         socket.emit('authenticated');
         pullManager.addSocket(socket);
      } else {
         socket.emit('unauthenticated');
         socket.disconnect();
      }
   });

   socket.on('refresh', function(repo, number) {
      refresh.pull(repo, number);
   });
});

debug("Listening on port %s", config.port);
httpServer.listen(config.port);
