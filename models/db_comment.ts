import * as utils from '../lib/utils';
import db from '../lib/db';
import getLogin from '../lib/get-user-login';
import debugFactory from '../lib/debug';
const debug = debugFactory('pulldasher:db_comment');

/**
 * Builds an object representation of a row in the DB `comments` table
 * from the Comment object.
 */
export default class DBComment {
   data = null;

   constructor(comment) {
      var commentData = comment.data;
      this.data = {
         number:     commentData.number,
         repo:       commentData.repo,
         user:       getLogin(commentData.user),
         date:       utils.toUnixTime(commentData.created_at),
         comment_type: commentData.comment_type,
         comment_id: commentData.comment_id
      };
   }

   save() {
      var commentData = this.data;
      var q_update = 'REPLACE INTO comments SET ?';

      return db.query(q_update, commentData);
   }

   static delete(repo, type, comment_id) {
      debug("deleting %s comment %s in repo %s", type, comment_id, repo);
      var q_delete = 'DELETE FROM comments \
                      WHERE `comment_type` = ? \
                      AND `comment_id` = ? \
                      AND `repo` = ?';

      return db.query(q_delete, [type, comment_id, repo]).then(function() {
         debug('deleted %s comment %s in repo %s', type, comment_id, repo);
      });
   }
}
