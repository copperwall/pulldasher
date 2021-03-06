import config from '../config';
import debugFactory from './debug';
const debug = debugFactory('pulldasher:authentication');
import gitManager from './git-manager';
const github = gitManager.github;
import * as passport from 'passport';
import * as _ from 'underscore';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Application, Request, Response, NextFunction } from 'express';

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(obj ,done) {
   done(null, obj);
});

type AuthenticatedRequest = Request & {
   logIn: Function,
   isAuthenticated: () => boolean,
   session: {
      auth_redirect: string
   }
}

passport.use(new GitHubStrategy({
      clientID: config.github.clientId,
      clientSecret: config.github.secret,
      callbackURL: config.github.callbackURL,
      // Since we only need to get the username to verify they are a member of
      // a team we don't need anything other than public info.
      scope: null
   },
   function(accessToken, refreshToken, profile, done) {
      debug("Authenticating user: " + profile.username);
      return done(null, profile);
   })
);

export default {
   passport: passport,
   setupRoutes: function(app: Application) {
      app.get('/auth/github', passport.authenticate('github'));
      app.get('/auth/github/callback', function(req: AuthenticatedRequest, res: Response, next: NextFunction) {
         passport.authenticate('github',
         function(err, user, info) {
            if (err) {
               debug("Error: " + err);
               return next(err);
            }

            if (user === undefined) {
               debug("Bad user");
               return next("Bad user");
            }

            debug("Authenticated with github: " + user.username);
            confirmOrgMembership(user)
            .then(function(authResponse) {
               debug("Authenticated with org: " + user.username);
               req.logIn(user, function(err) {
                  debug('Got login from ' + user.username);

                  // Redirect user to original URL. Fallback to '/' if DNE.
                  var redirectUrl = req.session.auth_redirect;
                  delete req.session.auth_redirect;

                  res.redirect(redirectUrl || '/');
               });
            });
         })(req,res,next);
      });

      // Ensure index is authenticated.
      app.get('/', function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
         if (req.isAuthenticated()) { return next(); }

         // Store original URL for post-auth redirect
         req.session.auth_redirect = req.originalUrl;
         res.redirect('/auth/github');
      });
   }
};


let checkOrgMembershipRequirements;

if (config.github.requireTeam) {
   // All this logic is needed to get the team id from a team name
   const getTeamId = github.teams.list({org: config.github.requireOrg})
   .then(function(teams) {
      const team = _.findWhere(teams, {name: config.github.requireTeam});
      if (!team) {
         const m = "Team " + (config.github.requireTeam) + " not found in Organization: " + config.github.requireOrg;
         debug(m);
         console.error(m);
         process.exit(1);
      }
      return team.id;
   });

   checkOrgMembershipRequirements = function(options) {
      return getTeamId.then(function(teamId) {
         options.id = teamId;
         return github.teams.getMembership(options);
      });
   };
} else {
   checkOrgMembershipRequirements = github.orgs.checkMembership;
}

function confirmOrgMembership(user) {
   return checkOrgMembershipRequirements({
      org: config.github.requireOrg,
      username: user.username
   });
}
