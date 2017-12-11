var utils = require('../lib/utils');
var getLogin = require('../lib/get-user-login');

/**
 * A Pull Request comment.
 */
modules.exports = class Comment {
   data = null;
   
   constructor(data) {
      this.data = {
         number:        data.number,
         repo:          data.repo,
         user: {
            login: getLogin(data.user)
         },
         created_at:    new Date(data.created_at),
         comment_type:  data.type,
         comment_id:    data.id
      };
   }

   /**
    * Takes an object representing a DB row, and returns an instance of this
    * Comment object.
    */
   getFromDB(data) {
      return new Comment({
         number:     data.number,
         repo:       data.repo,
         user: {
            login: data.user
         },
         created_at: utils.fromUnixTime(data.date),
         type:       data.comment_type,
         id:         data.comment_id
      });
   }
}
