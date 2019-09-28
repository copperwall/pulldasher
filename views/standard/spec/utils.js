// These are various utility functions for the rest of the config.

function parseCommaList(strList) {
   return typeof strList === 'string' ? strList.split(',') : [];
}

export default {
   shouldShowPull(pull) {
      return pull.state === 'open' && !pull.hasLabel('Cryogenic Storage');
   },
   filterAuthors() {
      const searchParams = new URLSearchParams(window.location.search);
      const assigned = searchParams.get('assigned');

      return parseCommaList(assigned);
   },
   filterMilestones() {
      const searchParams = new URLSearchParams(window.location.search);
      const milestone = searchParams.get('milestone');

      return parseCommaList(milestone);
   }
};
