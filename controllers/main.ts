import socketAuthenticator from '../lib/socket-auth';
var socketio = require('../../package.json').dependencies['socket.io'];
import config from '../config';

export default {
   index: function(req, res) {
      res.render('current/index', {
         socketToken: socketAuthenticator.getTokenForUser(req.user),
         socketVersion: socketio,
         user: req.user.username,
         debug: config.debug
      });
   }
};
