import * as utils from '../lib/utils';
import getLogin from '../lib/get-user-login';

/**
 * A Pull Request comment.
 */
export default class Comment {
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
   static getFromDB(data) {
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
