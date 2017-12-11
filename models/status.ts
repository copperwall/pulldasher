/**
 * An object representing the build status of the head commit of a pull.
 */
export default class Status {
   data = null;
   constructor(data) {
      this.data = {
         repo: data.repo,
         sha: data.sha,
         target_url: data.target_url,
         description: data.description,
         state: data.state
      };
   }

   /**
    * Takes an object representing a DB row, and returns an object which mimics
    * a GitHub API response which may be used to initialize an instance of this
    * Status object.
    */
   static getFromDB(data) {
      return new Status({
         sha:           data.commit,
         target_url:    data.log_url,
         description:   data.description,
         state:         data.state
      });
   }
};
