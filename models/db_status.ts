import _ from 'underscore';
import db from '../lib/db';

// Builds an object representation of a row in the DB `commit_statuses`
// table from the data returned by GitHub's API.
export default class DBStatus {
   data = null;

   constructor(status) {
      var statusData = status.data;
      this.data = {
         repo: statusData.repo,
         commit: statusData.sha,
         state: statusData.state,
         description: statusData.description,
         log_url: statusData.target_url
      };
   }

   save() {
      var statusData = this.data;
      var q_update = 'REPLACE INTO commit_statuses SET ?';

      return db.query(q_update, statusData);
   }

   toObject() {
      return _.extend({}, this.data);
   }
};