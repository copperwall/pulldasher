import socketAuthenticator from '../lib/socket-auth';
var socketio = require('../../package.json').dependencies['socket.io'];
import config from '../config';
import { Request, Response } from 'express';

type AuthenticatedRequest = Request & {
   user: {
      username: string
   }
};

export default {
   index: function(req: AuthenticatedRequest, res: Response) {
      res.render('current/index', {
         socketToken: socketAuthenticator.getTokenForUser(req.user),
         socketVersion: socketio,
         user: req.user.username,
         debug: config.debug
      });
   }
};
