import utils from '../lib/utils';
import db from '../lib/db';

// Builds an object representation of a row in the DB `pull_labels` table
// from an instance of the Label model
export default class DBLabel {
   data = null;

   constructor(label) {
      var labelData = label.data;
      this.data = {
         number: labelData.number,
         title: labelData.title,
         repo: labelData.repo,
         user: labelData.user,
         date: utils.toUnixTime(labelData.created_at)
      };
   }

   save() {
      var labelData = this.data;
      var q_update = 'REPLACE INTO pull_labels SET ?';

      return db.query(q_update, labelData);
   }

   delete() {
      var labelData = this.data;
      var q_update = 'DELETE FROM pull_labels WHERE ' +
       'number = ? AND title = ? AND repo = ?';

      return db.query(q_update, [labelData.number, labelData.title,
       labelData.repo]);
   }
};
