import utils from '../lib/utils';
import getLogin from '../lib/get-user-login';
import getUserid from '../lib/get-user-id';
import db from '../lib/db';

/**
 * Builds an object representation of a row in the DB `pull_signatures` table
 * from the Signature object.
 */
export default class DBSignature {
   constructor(signature) {
      var sigData = signature.data;
      this.data = {
         repo:       sigData.repo,
         number:     sigData.number,
         user:       getLogin(sigData.user),
         userid:     getUserid(sigData.user),
         type:       sigData.type,
         date:       utils.toUnixTime(sigData.created_at),
         active:     sigData.active,
         comment_id: sigData.comment_id
      };
   }

   save() {
      var sigData = this.data;
      var q_insert = 'INSERT INTO pull_signatures SET ?';

      return db.query(q_insert, sigData);
   }
};
